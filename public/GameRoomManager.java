package cc.fotoplace.app2.game.manager;

import cc.fotoplace.app2.base.constant.PageCatQuery;
import cc.fotoplace.app2.base.game.RoomStartMessage;
import cc.fotoplace.app2.common.component.MQProducter;
import cc.fotoplace.app2.common.image.ImageManager;
import cc.fotoplace.app2.game.constant.ErrorCode;
import cc.fotoplace.app2.game.dao.GameRoomDao;
import cc.fotoplace.app2.game.domain.dto.GameInviteDto;
import cc.fotoplace.app2.game.domain.dto.GameRoomDto;
import cc.fotoplace.app2.game.domain.dto.GameRoomShareDto;
import cc.fotoplace.app2.game.domain.dto.GameSubjectDto;
import cc.fotoplace.app2.game.domain.model.*;
import cc.fotoplace.app2.game.domain.param.*;
import cc.fotoplace.app2.game.mongo.manager.MongoManager;
import cc.fotoplace.app2.user.service.UserDiamondService;
import com.google.common.collect.Lists;
import com.vip.vjtools.vjkit.collection.ArrayUtil;
import com.vip.vjtools.vjkit.number.RandomUtil;
import me.j360.framework.base.domain.rpc.result.DefaultResult;
import me.j360.framework.common.exception.BizException;
import me.j360.framework.core.kit.mapper.orika.BeanMapper;
import org.apache.commons.collections4.CollectionUtils;
import org.apache.commons.lang3.StringUtils;
import org.apache.dubbo.config.annotation.Reference;
import org.redisson.api.RList;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author: min_xu
 */

@Component
public class GameRoomManager {

    @Autowired
    private GameRoomDao gameRoomDao;
    @Autowired
    private GameKeyManager gameKeyManager;
    @Reference(interfaceClass = UserDiamondService.class)
    private UserDiamondService userDiamondService;
    @Autowired
    private MongoManager mongoManager;
    @Autowired
    private GameFetchManager gameFetchManager;
    @Autowired
    private MQProducter mqProducter;
    @Autowired
    private UserGameRoomManager userGameRoomManager;
    @Autowired
    private ImageManager imageManager;

    public GameRoomDto createGameRoom(GameRoomAddParam param) {
        GameRoomDO gameRoomDO = new GameRoomDO();
        gameRoomDO.setPrivated(Optional.ofNullable(param.getPrivated()).orElse(0));
        gameRoomDO.setCreater(param.getUid());
        gameRoomDO.setOwner(param.getUid());
        gameRoomDO.setKeyword(gameKeyManager.getKey());
        gameRoomDO.setGameCat(param.getCatId());
        gameRoomDO.setGameType(param.getType());
        gameRoomDO.setRound(0);
        gameRoomDO.setStatus(0);

        try {
            gameRoomDao.add(gameRoomDO);
        } catch (Exception e) {
            gameKeyManager.releaseKey(gameRoomDO.getKeyword());
        }

        joinRoom(gameRoomDO, param.getUid());

        GameRoomDto dto = BeanMapper.map(gameRoomDO, GameRoomDto.class);

        //生成一个mq定时器5S后没有匹配完,让机器人匹配
        RoomStartMessage roomStartMessage = new RoomStartMessage();
        roomStartMessage.setUid(param.getUid());
        roomStartMessage.setRoomId(gameRoomDO.getId());
        roomStartMessage.setQuick(false);
        mqProducter.createRoomStartMessage(roomStartMessage);

        //同步数据到mongo
        userGameRoomManager.syncMongoRoomWithSubjects(gameRoomDO);
        return dto;
    }

    public GameRoomDto searchGameRoom(GameRoomKeyParam param) {
        GameRoomDO gameRoomDO = gameRoomDao.getBykey(param.getKey());
        GameRoomDto dto = BeanMapper.map(gameRoomDO, GameRoomDto.class);
        return dto;
    }

    /**
     * 匹配房间,进入房间匹配列表
     *
     * @param param
     * @return
     */
    public void fetchGameRoom(GameRoomJoinParam param) {
        gameFetchManager.addFetchUser(param);
    }


    /**
     * 回到房间并写入数据, 不再对外匹配,玩家点击再玩一局是返回房间页面并准备
     * @param param
     */
    public void backAndJoinRoom(GameRoomJoinParam param) {

    }

    /**
     * 快速匹配状态
     * 1、房间状态更新 redis + dao
     * 2、生成定时器
     *
     * @param roomId
     * @param uid
     */
    public void quickSearch(Long roomId, Long uid) {
        GameRoomDO gameRoomDO = gameRoomDao.get(roomId);
        if (Objects.isNull(gameRoomDO)) {
            return;
        }
        gameFetchManager.updateFetchQuickSocre(gameRoomDO);

        gameRoomDO.setUpdateTime(System.currentTimeMillis());
        gameRoomDO.setQuickSearch(1);
        gameRoomDao.updateQuickStatus(gameRoomDO);

        //生成一个mq定时器5S后没有匹配完,让机器人匹配
        RoomStartMessage roomStartMessage = new RoomStartMessage();
        roomStartMessage.setUid(uid);
        roomStartMessage.setRoomId(roomId);
        roomStartMessage.setQuick(true);
        mqProducter.createRoomStartMessage(roomStartMessage);

        //TODO 更新mongo数据库

    }

    /**
     * 根据ID
     *
     * @param roomId
     * @param uid
     * @return
     */
    public GameRoomDto joinGameRoomById(Long roomId, Long uid) {
        return joinGameRoomById(roomId, uid, false);
    }

    public GameRoomDto joinRobotToGameRoomById(Long roomId, Long uid) {
        return joinGameRoomById(roomId, uid, true);
    }

    public GameRoomDto joinGameRoomById(Long roomId, Long uid, boolean robot) {
        GameRoomDO gameRoomDO = gameRoomDao.get(roomId);
        if (Objects.nonNull(gameRoomDO)) {
            joinRoom(gameRoomDO, uid, robot);
            return convert(gameRoomDO);
        }
        return null;
    }


    public GameRoomDto joinGameRoomByKey(String key, Long uid) {
        GameRoomDO gameRoomDO = gameRoomDao.getBykey(key);
        if (Objects.nonNull(gameRoomDO)) {
            joinRoom(gameRoomDO, uid);
            return convert(gameRoomDO);
        }

        return null;
    }

    /**
     * 房间开始游戏
     *
     * @param roomId
     * @param uid
     */
    public void roomStart(Long roomId, Long uid) {
        GameRoomDO roomDO = gameRoomDao.get(roomId);
        if (Objects.nonNull(roomDO)) {

            roomDO.setStatus(1);
            gameRoomDao.updateStatus(roomDO);

            GameRoomJoinParam param = new GameRoomJoinParam();
            param.setType(roomDO.getGameType());
            param.setCatId(roomDO.getGameCat());
            gameFetchManager.removeFetchRoom(param, roomId);
        }

    }

    /**
     * 离开房间
     *
     * @param roomId
     * @param uid
     */
    public void leaveRoom(Long roomId, Long uid) {
        GameRoomDO roomDO = gameRoomDao.get(roomId);
        gameFetchManager.minusAndLeaveFetchRoom(roomDO, uid);

        List<Long> list = gameFetchManager.getRoomUsers(roomId);
        Integer usersCount = list.size();

        //从game_room_user中剔除
        GameRoomUserDO gameRoomUserDO = new GameRoomUserDO();
        gameRoomUserDO.setRoomId(roomId);
        gameRoomUserDO.setUid(uid);
        gameRoomUserDO.setStatus(1);
        gameRoomDao.updateUserStatus(gameRoomUserDO);

        //让出群主
        if (usersCount > 1) {
            Long newOwnerUid = gameFetchManager.removeRoomUser(roomId, uid);
            if (Objects.nonNull(newOwnerUid)) {
                roomDO.setOwner(newOwnerUid);
                gameRoomDao.updateOwner(roomDO);
            }
        } else {
            //解散群
            dismissRoom(roomId);
        }
    }

    /**
     * 解散群
     *
     * @param roomId
     */
    public void dismissRoom(Long roomId) {
        GameRoomDO gameRoomDO = gameRoomDao.get(roomId);
        if (Objects.nonNull(gameRoomDO)) {
            gameRoomDO.setStatus(2);
            gameRoomDao.updateStatus(gameRoomDO);

            //删除redis
            GameRoomJoinParam param = new GameRoomJoinParam();
            param.setCatId(gameRoomDO.getGameCat());
            param.setType(gameRoomDO.getGameType());
            gameFetchManager.removeFetchRoom(param, roomId);

            gameKeyManager.releaseKey(gameRoomDO.getKeyword());
        }
    }

    public void chat(GameRoomChatParam param) {

    }


    public Long getUserRoom(Long uid) {
        GameRoomUserDO gameRoomUserDO = gameRoomDao.getRoomUserByUid(uid);
        if (Objects.nonNull(gameRoomUserDO)) {
            return gameRoomUserDO.getId();
        }
        return 0L;
    }

    /**
     * 踢人动作
     *
     * @param param
     */
    public boolean kickOff(GameRoomKickOffParam param) {
        DefaultResult<Integer> result = userDiamondService.getUserVipValue(param.getUid());
        if (!result.isSuccess()) {
            throw BizException.newBizException(new ErrorCode(result.getCode(), result.getMsg()));
        }

        DefaultResult<Integer> targetResult = userDiamondService.getUserVipValue(param.getTargetUid());
        if (!targetResult.isSuccess()) {
            throw BizException.newBizException(new ErrorCode(targetResult.getCode(), targetResult.getMsg()));
        }

        if (result.getData() <= targetResult.getData()) {
            throw BizException.newBizException(ErrorCode.VIP_KICKOFF_FAIL);
        }

        GameRoomUserDO gameRoomUserDO = new GameRoomUserDO();
        gameRoomUserDO.setRoomId(param.getRoomId());
        gameRoomUserDO.setUid(param.getTargetUid());
        gameRoomDao.kickOffUser(gameRoomUserDO);


        GameRoomDO gameRoomDO = gameRoomDao.get(param.getRoomId());
        gameFetchManager.minusAndLeaveFetchRoom(gameRoomDO, param.getTargetUid());
        gameFetchManager.removeRoomUser(param.getRoomId(), param.getTargetUid());
        return true;
    }

    /**
     * 添加机器人
     * 1.判断房间是否存在
     * 2.判断房间是否已满
     *
     * @param roomId
     */
    public void addRobotToRoom(Long roomId, Boolean quick) {
        GameRoomDO gameRoomDO = gameRoomDao.get(roomId);
        RList<Long> users = gameFetchManager.getRoomUsers(roomId);
        if (users.size() < 6) {
            List<Long> robots = getRobots();
            if (Boolean.TRUE.equals(quick)) {
                //填充满
                addRobotToRoom(gameRoomDO, users, robots, 6);
            } else {
                //填充1-2个
                boolean result = addRobotToRoom(gameRoomDO, users, robots, RandomUtil.nextInt(3));

                //生成一个mq定时器5S后没有匹配完,让机器人匹配
                //当前房间没有完成
                if (!result) {
                    RoomStartMessage roomStartMessage = new RoomStartMessage();
                    roomStartMessage.setUid(0L);
                    roomStartMessage.setRoomId(roomId);
                    roomStartMessage.setQuick(true);
                    mqProducter.createRoomStartMessage(roomStartMessage);
                }
            }
        }
    }

    //TODO
    public List<Long> getRobots() {
        List<Long> robots = Lists.newArrayListWithExpectedSize(10000);
        for (long i = 1; i <= 10000; i++) {
            robots.add(i);
        }
        return robots;
    }


    /**
     * 返回是否完成房间
     * @param gameRoomDO
     * @param users
     * @param robotUsers
     * @param count
     * @return
     */
    private boolean addRobotToRoom(GameRoomDO gameRoomDO, RList<Long> users, List<Long> robotUsers, int count) {
        Long roomId = gameRoomDO.getId();
        int index = 0;
        for (Long robotUid : robotUsers) {
            users = gameFetchManager.getRoomUsers(roomId);
            if (users.size() < 6 && index <= count) {
                if (users.contains(robotUid)) {
                    continue;
                }
                index ++;
                //当前用户UID加入到房间
                joinRobotToGameRoomById(roomId, robotUid);
                users.add(robotUid);
                //重新计算房间的score
                gameFetchManager.updateFetchAddUserRoom(gameRoomDO);

                if (users.size() >= 6) {
                    //设置成已完成并从排队队列中删除
                    GameRoomJoinParam param = new GameRoomJoinParam();
                    param.setType(gameRoomDO.getGameType());
                    param.setCatId(gameRoomDO.getGameCat());
                    gameFetchManager.removeFetchRoom(param, roomId);
                    return true;
                }
            } else {
                break;
            }
        }
        return false;
    }


    private void joinRoom(GameRoomDO gameRoomDO, Long uid, boolean robot) {
        GameRoomUserDO gameRoomUserDO = new GameRoomUserDO();
        gameRoomUserDO.setUid(uid);
        gameRoomUserDO.setRoomId(gameRoomDO.getId());
        gameRoomUserDO.setRound(0);
        gameRoomUserDO.setStatus(0);
        gameRoomUserDO.setRobot(robot ? 1 : 0);
        gameRoomDao.addUser(gameRoomUserDO);

        gameFetchManager.addNewFetchRoom(gameRoomDO);

        GameRoomJoinParam param = new GameRoomJoinParam();
        param.setCatId(gameRoomDO.getGameCat());
        param.setType(gameRoomDO.getGameType());
        param.setUid(uid);
        gameFetchManager.addFetchUser(param);
    }

    //添加普通用户到房间
    private void joinRoom(GameRoomDO gameRoomDO, Long uid) {
        joinRoom(gameRoomDO, uid, false);
    }

    /**
     * 获取随机的题目数据 0音乐，1电影
     *
     * @param type
     * @param catId
     * @return
     */
    public List<GameSubjectDto> listRandomSubjects(Integer type, Long catId) {
        PageCatQuery query = new PageCatQuery();
        query.setCatId(catId);
        query.setSize(10);

        List<SubjectDO> list;
        if (0 == type) {
            int count = gameRoomDao.countMusicSubjects(query);
            int num = count - query.getSize();
            if (num <= 0) {
                return Collections.EMPTY_LIST;
            }
            int offset = RandomUtil.nextInt(num);
            query.setOffset(offset);
            list = gameRoomDao.listMusicSubjects(query);
        } else {
            int count = gameRoomDao.countMovieSubjects(query);
            int num = count - query.getSize();
            if (num <= 0) {
                return Collections.EMPTY_LIST;
            }
            int offset = RandomUtil.nextInt(num);
            query.setOffset(offset);
            list = gameRoomDao.listMovieSubjects(query);
        }
        //转化成dto
        if (CollectionUtils.isEmpty(list)) {
            return Collections.EMPTY_LIST;
        }

        List<GameSubjectDto> subjectDtos = Lists.newArrayListWithExpectedSize(list.size());
        for (SubjectDO subjectDO : list) {
            GameSubjectDto dto = new GameSubjectDto();
            dto.setId(subjectDO.getId());
            dto.setAnswer(subjectDO.getName());
            dto.setAudio(imageManager.getFullUrl(subjectDO.getFileUrl()));
            dto.setType(type);
            dto.setTip(subjectDO.getTipEnd());
            dto.setHint(new String[]{subjectDO.getTip1(), subjectDO.getTip2(), subjectDO.getTip3()});
            //21个题目答案文字
            dto.setChoices(choices(type, dto.getAnswer()));
            subjectDtos.add(dto);
        }
        return subjectDtos;
    }


    public GameRoomShareDto getShareInfo(GameRoomShareParam param) {
        GameUserDO userDO = mongoManager.getUserById(param.getUid());
        GameRoomShareDto dto = new GameRoomShareDto();
        if (Objects.nonNull(userDO)) {
            dto.setUid(param.getUid());
            dto.setRoomId(param.getRoomId());
            dto.setUserName(userDO.getName());
            dto.setAvatar(userDO.getAvatar().getHead());
            dto.setPerUrl(userDO.getAvatar().getFull());
            dto.setMedalUrl("");
        }

        //room info
        GameRoomUserDO gameRoomUserDO = gameRoomDao.getRoomUser(param.getRoomId(), param.getUid());
        if (Objects.nonNull(gameRoomUserDO)) {
            dto.setScore(gameRoomUserDO.getScore());
            dto.setSno(gameRoomUserDO.getSno());
            dto.setPercent(gameRoomUserDO.getPercent());
        }

        GameRoomDO roomDO = gameRoomDao.get(param.getRoomId());
        if (Objects.nonNull(roomDO)) {
            dto.setDesc("");
            //TODO
            dto.setLinkUrl("");
            SubjectDO subjectDO = getRandomSubject(roomDO);
            if (Objects.nonNull(subjectDO)) {
                dto.setDesc(subjectDO.getAuthor() + " " + subjectDO.getName() + " " + subjectDO.getSubtitle());
            }
        }
        return dto;
    }


    /**
     * 进入下一轮
     * 回到房间, 全部都是机器人都剔除
     *
     * @param gameRoomDO
     */
    public void createNextRoundGameRoom(GameRoomDO gameRoomDO, List<GameRoomUserDO> users) {

    }

    public GameInviteDto getInviteInfo(Long uid) {
        GameUserDO userDO = mongoManager.getUserById(uid);
        GameInviteDto dto = new GameInviteDto();
        if (Objects.nonNull(userDO)) {
            dto.setUid(uid);
            dto.setUserName(userDO.getName());
            dto.setAvatar(userDO.getAvatar().getHead());
            dto.setPerUrl(userDO.getAvatar().getFull());
        }
        //TODO
        dto.setLinkUrl("");

        return dto;
    }


    private SubjectDO getRandomSubject(GameRoomDO gameRoomDO) {
        List<GameRoomSubjectDO> subjectDOList = gameRoomDao.listRoomSubjects(gameRoomDO.getId());
        if (CollectionUtils.isEmpty(subjectDOList)) {
            return null;
        }
        List<Long> ids = CollectionUtils.collect(subjectDOList, GameRoomSubjectDO::getSubjectId).stream().collect(Collectors.toList());
        Long randomId = ids.get(RandomUtil.nextInt(ids.size()));
        if (Objects.equals(0, gameRoomDO.getGameType())) {
            return gameRoomDao.getMusicSubject(randomId);
        } else {
            return gameRoomDao.getMovieSubject(randomId);
        }
    }

    /**
     * 获取题目库中的其他文字排除当前名字,+当前名字
     * 共21个文字
     * type 0音乐 1电影
     *
     * @param type
     * @param nameSkip
     * @return
     */
    private String[] choices(int type, String nameSkip) {
        String text = getSourceText(type);
        int size = text.length();
        int offset = RandomUtil.nextInt(size - 21 - nameSkip.length());
        String choiceText = StringUtils.substring(text, offset, offset + 21 - nameSkip.length());
        choiceText = choiceText + nameSkip;
        String[] texts = StringUtils.split(choiceText, "");
        return ArrayUtil.shuffle(texts);
    }


    private String getSourceText(int type) {
        List<String> list;
        if (0 == type) {
            list = gameRoomDao.listMusicChinese();
        } else {
            list = gameRoomDao.listMusicChinese();
        }
        StringBuilder builder = new StringBuilder();
        list.forEach(t -> {
            builder.append(t);
        });
        //排重并唯一
        return builder.toString().replaceAll("(.)(?=.*\\1)", "");
    }

    private GameRoomDto convert(GameRoomDO gameRoomDO) {
        GameRoomDto dto = new GameRoomDto();
        dto.setId(gameRoomDO.getId());
        dto.setCreater(gameRoomDO.getCreater());

        return dto;
    }
}
