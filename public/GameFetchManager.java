package cc.fotoplace.app2.game.manager;

import cc.fotoplace.app2.base.constant.AppConfig;
import cc.fotoplace.app2.base.game.GameKeys;
import cc.fotoplace.app2.game.dao.GameMovieDao;
import cc.fotoplace.app2.game.dao.GameMusicDao;
import cc.fotoplace.app2.game.domain.dto.GameRoomDto;
import cc.fotoplace.app2.game.domain.model.GameRoomDO;
import cc.fotoplace.app2.game.domain.param.GameRoomAddParam;
import cc.fotoplace.app2.game.domain.param.GameRoomJoinParam;
import lombok.extern.slf4j.Slf4j;
import me.j360.framework.common.pool.DefaultExecutor;
import org.redisson.api.RList;
import org.redisson.api.RLock;
import org.redisson.api.RScoredSortedSet;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.LongCodec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;

/**
 * @author: min_xu
 */
@Slf4j
@Component
public class GameFetchManager {


    @Autowired
    private RedissonClient redissonClient;
    @Autowired
    private GameMusicDao gameMusicDao;
    @Autowired
    private GameMovieDao gameMovieDao;
    @Autowired
    private GameRoomManager gameRoomManager;

    private static String FETCH_MUSIC_LOCK_TMP = AppConfig.REDIS_PREFIX_FLODER + "fetch:lock:music";
    private static String FETCH_MOVIE_LOCK_TMP = AppConfig.REDIS_PREFIX_FLODER + "fetch:lock:movie";

    //房间人的信息
    private static String FETCH_ROOM_UIDS = AppConfig.REDIS_PREFIX_FLODER + "fetch:room:uids:%d";

//    //TODO TEST用户创建房间 3s 产生一个房间
//    @Scheduled(fixedDelay = 5000)
//    public void schedulerUserCreateTest() {
//        GameRoomAddParam param = new GameRoomAddParam();
//        param.setCatId(1L);
//        param.setType(0);
//        param.setUid(RandomUtil.nextLong(10000L));
//        param.setPrivated(0);
//        gameRoomManager.createGameRoom(param);
//    }

//    @Scheduled(fixedDelay = 500)
//    public void schedulerUserCreateTest2() {
//        GameRoomAddParam param = new GameRoomAddParam();
//        param.setCatId(1L);
//        param.setType(1);
//        param.setUid(RandomUtil.nextLong(30000L, 40000L));
//        param.setPrivated(0);
//        gameRoomManager.createGameRoom(param);
//    }

//    //TODO TEST用户匹配房间 1s产生一条数据
//    @Scheduled(fixedDelay = 1000)
//    public void schedulerUserFetchTest() {
//        GameRoomJoinParam param = new GameRoomJoinParam();
//        param.setUid(RandomUtil.nextLong(10000L, 20000L));
//        param.setCatId(1L);
//        param.setType(0);
//        gameRoomManager.fetchGameRoom(param);
//
////        param = new GameRoomJoinParam();
////        param.setUid(RandomUtil.nextLong(50000L, 60000L));
////        param.setCatId(1L);
////        param.setType(1);
////        gameRoomManager.fetchGameRoom(param);
//    }


    private static String MUSIC_CAT_KEY = AppConfig.REDIS_PREFIX_FLODER + "music:cats";
    private static String MOVIE_CAT_KEY = AppConfig.REDIS_PREFIX_FLODER + "movie:cats";

    /**
     * 自动循环遍历匹配1S一次
     *
     * 每次找到对应的用户并匹配分值最高的房间
     *
     *
     */
    @Scheduled(fixedDelay = 1000)
    public void schedulerFetchMovie() {
        RLock rLock = redissonClient.getLock(FETCH_MOVIE_LOCK_TMP);
        rLock.lock();
        try {
            doFetchForMovieCat();
        } finally {
            rLock.unlock();
        }
    }

    @Scheduled(fixedDelay = 1000)
    public void schedulerFetchMusic() {
        RLock rLock = redissonClient.getLock(FETCH_MUSIC_LOCK_TMP);
        rLock.lock();
        try {
            doFetchForMusicCat();
        } finally {
            rLock.unlock();
        }
    }

    public void doFetchForMusicCat() {
        List<Long> list;
        RList<Long> rList = redissonClient.getList(MUSIC_CAT_KEY, LongCodec.INSTANCE);
        if (rList.isExists()) {
            list = rList.readAll();
            if (rList.remainTimeToLive() < 5000) {
                list = gameMusicDao.listCatIds();
                rList.clear();
                rList.addAll(list);
                rList.expire(5, TimeUnit.MINUTES);
            }
        } else {
            list = gameMusicDao.listCatIds();
            rList.addAll(list);
            rList.expire(5, TimeUnit.MINUTES);
        }
        list.forEach(id -> {
            DefaultExecutor.runSafeAsync(() -> {
                doFetchRoom(0, id);
            });
        });
    }

    public void doFetchForMovieCat() {
        List<Long> list;
        RList<Long> rList = redissonClient.getList(MOVIE_CAT_KEY, LongCodec.INSTANCE);
        if (rList.isExists()) {
            list = rList.readAll();
            if (rList.remainTimeToLive() < 5000) {
                list = gameMovieDao.listCatIds();
                rList.clear();
                rList.addAll(list);
                rList.expireAsync(5, TimeUnit.MINUTES);
            }
        } else {
            list = gameMovieDao.listCatIds();
            rList.addAllAsync(list);
            rList.expireAsync(5, TimeUnit.MINUTES);
        }
        list.forEach(id -> {
            DefaultExecutor.runSafeAsync(() -> {
                doFetchRoom(1, id);
            });
        });
    }

    /**
     * 针对每个房间的设计
     *
     * 匹配规则为：

     a.优先为用户匹配使用快速匹配功能的房间（按照创建房间先后顺序匹配进人）

     b.其次为用户匹配已创建的房间且包含空位的（优先人数较多的房间，人数相同时按照开房时间先后顺序匹配进人）

     c.若无房间，则将正在匹配的6玩家组成一个房间，房主为最早开始匹配的用户,走普通房间匹配逻辑

     * @param type
     * @param catId
     */
    public void doFetchRoom(Integer type, Long catId) {
        String userKey = String.format(GameKeys.GAME_USERS_FETCH_LIST, type, catId);
        RList<Long> userList = redissonClient.getList(userKey, LongCodec.INSTANCE);

        //找到10-60分的所有的房间, 60+则为满员房间
        String roomKey = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, type, catId);
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(roomKey, LongCodec.INSTANCE);

        Collection<Long> roomSets = sortedSet.valueRangeReversed(10, true, 60, true, 0, 100);
        Iterator<Long> iter = userList.iterator();
        Iterator<Long> roomIterator = roomSets.iterator();

        while(iter.hasNext()){
            Long uid = iter.next();
            if (roomSets.size() > 0) {
                //获取最高分数的房间
                Long roomId = 0L;
                while (roomIterator.hasNext()) {
                    //判断房间状态加入房间
                    roomId = roomIterator.next();
                    String roomUidKey = String.format(FETCH_ROOM_UIDS, roomId);
                    RList<Long> roomUidList = redissonClient.getList(roomUidKey, LongCodec.INSTANCE);
                    if (roomUidList.isExists() && roomUidList.size() >= 6) {
                        //设置成已完成并从排队队列中删除
                        sortedSet.remove(roomId);
                        roomIterator.remove();
                        continue;
                    } else {
                        break;
                    }
                }
                if (Objects.isNull(roomIterator)) {
                    break;
                }
                if (Objects.nonNull(roomId)) {
                    //添加到该房间
                    addUserToFetchRoom(roomId, uid, sortedSet, userList, roomIterator);
                } else {
                    //Non
                    nonFetchRoom(uid, type, catId);
                }
            } else {
                //Non
                nonFetchRoom(uid, type, catId);
            }
        }
    }

    //将排队的用排队进入到房间
    public void addUserToFetchRoom(Long roomId, Long uid, RScoredSortedSet<Long> sortedSet, RList<Long> userList, Iterator<Long> roomIterator) {
        String roomUidKey = String.format(FETCH_ROOM_UIDS, roomId);
        RList<Long> roomUidList = redissonClient.getList(roomUidKey, LongCodec.INSTANCE);

        //当前用户UID加入到房间
        GameRoomDto gameRoomDto = gameRoomManager.joinGameRoomById(roomId, uid);
        if (Objects.isNull(gameRoomDto)) {
            sortedSet.remove(roomId);

        } else {
            roomUidList.add(uid);
            //重新计算房间的score
            sortedSet.addScore(roomId, 10);
            if (roomUidList.size() >= 6) {
                //设置成已完成并从排队队列中删除
                sortedSet.remove(roomId);
                roomIterator.remove();
            }
            userList.remove(uid);
        }
    }

    /**
     * 没有房间时的动作
     * 1:当前用户生成一个房间
     * 2:其他人加入 doFetchRoom(type, catId)
     * @param uid
     * @param type
     * @param catId
     */
    public void nonFetchRoom(Long uid, Integer type, Long catId) {
        //生成一个房间
        GameRoomAddParam param = new GameRoomAddParam();
        param.setUid(uid);
        param.setType(type);
        param.setCatId(catId);
        gameRoomManager.createGameRoom(param);
    }

    public Long addAndJoinFetchRoom(GameRoomDO gameRoomDO, Long uid) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.add(10, gameRoomDO.getId());

        //uid 从list

        return 0L;
    }

    public Integer minusAndLeaveFetchRoom(GameRoomDO gameRoomDO, Long uid) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.addScore(gameRoomDO.getId(), -10);

        //uid 添加到list
        return sortedSet.size();
    }

    public Long addNewFetchRoom(GameRoomDO gameRoomDO) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.add(10, gameRoomDO.getId());
        return 0L;
    }

    /**
     * 添加房间等级
     * @param gameRoomDO
     * @return
     */
    public Long updateFetchAddUserRoom(GameRoomDO gameRoomDO) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.addScore(gameRoomDO.getId(), 10L);
        return 0L;
    }

    /**
     * 添加房间等级
     * @param gameRoomDO
     * @return
     */
    public Long updateFetchQuickSocre(GameRoomDO gameRoomDO) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.addScore(gameRoomDO.getId(), 50L);
        return 0L;
    }

    //ZSET KEY:0-CATID VALUE roomID -> score userCount * 10 + quickSearch + 50 + timestamp (0> <10)
    //1*10+(1-10) max:60+10.00 min:10+0.00  60+以上则是完成匹配的部分, 0-60则是未完成匹配的部分
    public Long updateFetchRoomSocre(GameRoomDO gameRoomDO, Double addScore) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, gameRoomDO.getGameType(), gameRoomDO.getGameCat());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.addScore(gameRoomDO.getId(), addScore);
        return 0L;
    }


    public Long getFetchRoom(GameRoomJoinParam param) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, param.getType(), param.getCatId());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        Long roomId = sortedSet.last();
        return roomId;
    }

    /**
     * 删除需要匹配的房间
     * @param param
     * @param roomId
     */
    public void removeFetchRoom(GameRoomJoinParam param, Long roomId) {
        String key = String.format(GameKeys.GAME_ROOMS_FETCH_SCORE, param.getType(), param.getCatId());
        RScoredSortedSet<Long> sortedSet =  redissonClient.getScoredSortedSet(key, LongCodec.INSTANCE);
        sortedSet.remove(roomId);
    }


    /**
     * 将用户添加到房间redis
     * @param param
     */
    public void addFetchUser(GameRoomJoinParam param) {
        String key = String.format(GameKeys.GAME_USERS_FETCH_LIST, param.getType(), param.getCatId());
        RList<Long> list = redissonClient.getList(key, LongCodec.INSTANCE);
        if (!list.contains(param.getUid())) {
            list.add(param.getUid());
        }
    }


    public boolean removeFetchUser(GameRoomJoinParam param) {
        String key = String.format(GameKeys.GAME_USERS_FETCH_LIST, param.getType(), param.getCatId());
        RList<Long> list = redissonClient.getList(key, LongCodec.INSTANCE);
        list.remove(param.getUid());
        return true;
    }

    /**
     * 返回房间所以用户
     * @param roomId
     * @return
     */
    public RList<Long> getRoomUsers(Long roomId) {
        String roomUidKey = String.format(FETCH_ROOM_UIDS, roomId);
        RList<Long> roomUidList = redissonClient.getList(roomUidKey, LongCodec.INSTANCE);
        return roomUidList;
    }

    /**
     * 删除用户并返回第一个用户
     * @param roomId
     * @param uid
     * @return
     */
    public Long removeRoomUser(Long roomId, Long uid) {
        String roomUidKey = String.format(FETCH_ROOM_UIDS, roomId);
        RList<Long> roomUidList = redissonClient.getList(roomUidKey, LongCodec.INSTANCE);
        roomUidList.remove(uid);
        return roomUidList.get(0);
    }
}
