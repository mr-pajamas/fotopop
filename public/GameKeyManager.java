package cc.fotoplace.app2.game.manager;

import cc.fotoplace.app2.base.constant.AppConfig;
import cc.fotoplace.app2.base.game.GameKeys;
import org.redisson.api.RList;
import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.redisson.client.codec.IntegerCodec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;

/**
 * @author: min_xu
 */

@Component
public class GameKeyManager {


    @Autowired
    private RedissonClient redissonClient;

    private RList<Integer> tokens;

    private static String TOKEN_INIT_LOCK_TMP = AppConfig.REDIS_PREFIX_FLODER + "token:lock";


    @PostConstruct
    public void init() {
        tokens = redissonClient.getList(GameKeys.GAME_ROOM_TOKENS, IntegerCodec.INSTANCE);
        RLock rLock = redissonClient.getLock(TOKEN_INIT_LOCK_TMP);
        rLock.lock();
        try {
            if (!tokens.isExists()) {
                if (tokens.size() == 0) {
                    for (int i = 100000; i < 1000000; i++) {
                        tokens.add(i);
                    }
                }
            }
        } finally {
            rLock.unlock();
        }
    }

    public String getKey() {
        Integer token = tokens.get(0);
        tokens.remove(token);
        return token.toString();
    }


    public void releaseKey(String token) {
        tokens.add(Integer.parseInt(token));
    }

    /**
     * 找到游戏表中因为各种原因未释放的Token
     */
    @Scheduled(cron = "0 0 1 * * *")
    public void schedulerRelease() {

    }

}
