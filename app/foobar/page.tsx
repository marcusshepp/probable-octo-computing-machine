'use client';
import {
  useState,
  useEffect,
  useRef,
} from 'react';

// Pong game constants
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Platformer game constants
const PLAYER_WIDTH = 30;
const PLAYER_HEIGHT = 50;
const PLATFORM_HEIGHT = 20;
const JUMP_FORCE = 15;
const GRAVITY = 0.8;

type GameObject = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export default function Page() {
    const [currentGame, setCurrentGame] =
        useState<'pong' | 'platformer'>('pong');

    // Pong game state
    const [leftPaddleY, setLeftPaddleY] =
        useState(
            GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2
        );
    const [rightPaddleY, setRightPaddleY] =
        useState(
            GAME_HEIGHT / 2 - PADDLE_HEIGHT / 2
        );
    const [ballX, setBallX] = useState(
        GAME_WIDTH / 2
    );
    const [ballY, setBallY] = useState(
        GAME_HEIGHT / 2
    );
    const [ballSpeedX, setBallSpeedX] =
        useState(3);
    const [ballSpeedY, setBallSpeedY] =
        useState(3);
    const [leftScore, setLeftScore] = useState(0);
    const [rightScore, setRightScore] =
        useState(0);

    // Platformer game state
    const [player, setPlayer] =
        useState<GameObject>({
            x: 50,
            y: GAME_HEIGHT - PLAYER_HEIGHT,
            width: PLAYER_WIDTH,
            height: PLAYER_HEIGHT,
        });
    const [platforms, setPlatforms] = useState<
        GameObject[]
    >([]);
    const [playerVelocityY, setPlayerVelocityY] =
        useState(0);
    const [isJumping, setIsJumping] =
        useState(false);
    const [score, setScore] = useState(0);

    const gameLoopRef = useRef<number | null>(
        null
    );

    useEffect(() => {
        if (currentGame === 'pong') {
            // Pong game loop
            const updatePongGame = () => {
                setBallX((prev) => {
                    let newX = prev + ballSpeedX;

                    // Ball collision with paddles
                    if (
                        (ballSpeedX < 0 &&
                            newX <=
                                PADDLE_WIDTH &&
                            ballY + BALL_SIZE >=
                                leftPaddleY &&
                            ballY <=
                                leftPaddleY +
                                    PADDLE_HEIGHT) ||
                        (ballSpeedX > 0 &&
                            newX >=
                                GAME_WIDTH -
                                    PADDLE_WIDTH -
                                    BALL_SIZE &&
                            ballY + BALL_SIZE >=
                                rightPaddleY &&
                            ballY <=
                                rightPaddleY +
                                    PADDLE_HEIGHT)
                    ) {
                        setBallSpeedX(
                            (prev) => -prev
                        );

                        // Adjust vertical speed based on where the ball hits the paddle
                        const paddleY =
                            ballSpeedX < 0
                                ? leftPaddleY
                                : rightPaddleY;
                        const relativeIntersectY =
                            paddleY +
                            PADDLE_HEIGHT / 2 -
                            (ballY +
                                BALL_SIZE / 2);
                        const normalizedRelativeIntersectionY =
                            relativeIntersectY /
                            (PADDLE_HEIGHT / 2);
                        const bounceAngle =
                            normalizedRelativeIntersectionY *
                            (Math.PI / 4); // Max angle: 45 degrees

                        setBallSpeedY(
                            -Math.sin(
                                bounceAngle
                            ) * 3
                        ); // Adjust the multiplier to control max vertical speed

                        // Ensure the ball is outside the paddle
                        return ballSpeedX < 0
                            ? PADDLE_WIDTH + 1
                            : GAME_WIDTH -
                                  PADDLE_WIDTH -
                                  BALL_SIZE -
                                  1;
                    }

                    // Ball collision with left and right walls
                    if (
                        newX <= 0 ||
                        newX >=
                            GAME_WIDTH - BALL_SIZE
                    ) {
                        setRightScore((prev) =>
                            newX <= 0
                                ? prev + 1
                                : prev
                        );
                        setLeftScore((prev) =>
                            newX >=
                            GAME_WIDTH - BALL_SIZE
                                ? prev + 1
                                : prev
                        );
                        return resetPongBall().x;
                    }

                    return newX;
                });

                setBallY((prev) => {
                    let newY = prev + ballSpeedY;
                    // Ball collision with top and bottom walls
                    if (
                        newY <= 0 ||
                        newY >=
                            GAME_HEIGHT -
                                BALL_SIZE
                    ) {
                        setBallSpeedY(
                            (prevSpeed) =>
                                -prevSpeed
                        );
                        return newY <= 0
                            ? 0
                            : GAME_HEIGHT -
                                  BALL_SIZE;
                    }
                    return newY;
                });

                // Score (only when the ball goes past the paddle)
                if (ballX < 0) {
                    setRightScore(
                        (prev) => prev + 1
                    );
                    resetPongBall();
                } else if (ballX > GAME_WIDTH) {
                    setLeftScore(
                        (prev) => prev + 1
                    );
                    resetPongBall();
                }
            };

            gameLoopRef.current =
                requestAnimationFrame(
                    function gameLoop() {
                        updatePongGame();
                        gameLoopRef.current =
                            requestAnimationFrame(
                                gameLoop
                            );
                    }
                );
        } else {
            // Platformer game loop
            const updatePlatformerGame = () => {
                setPlayer((prev) => {
                    const newY = Math.min(
                        prev.y + playerVelocityY,
                        GAME_HEIGHT -
                            PLAYER_HEIGHT
                    );
                    const isOnGround =
                        newY ===
                        GAME_HEIGHT -
                            PLAYER_HEIGHT;

                    if (isOnGround) {
                        setIsJumping(false);
                        setPlayerVelocityY(0);
                    } else {
                        setPlayerVelocityY(
                            (prev) =>
                                prev + GRAVITY
                        );
                    }

                    return { ...prev, y: newY };
                });

                // Move platforms to the left
                setPlatforms((prevPlatforms) => {
                    const newPlatforms =
                        prevPlatforms
                            .map((platform) => ({
                                ...platform,
                                x: platform.x - 2,
                            }))
                            .filter(
                                (platform) =>
                                    platform.x +
                                        platform.width >
                                    0
                            );

                    // Add new platform if needed
                    if (newPlatforms.length < 5) {
                        newPlatforms.push({
                            x: GAME_WIDTH,
                            y:
                                Math.random() *
                                    (GAME_HEIGHT -
                                        200) +
                                100,
                            width:
                                Math.random() *
                                    100 +
                                50,
                            height: PLATFORM_HEIGHT,
                        });
                    }

                    return newPlatforms;
                });

                // Check for collisions
                platforms.forEach((platform) => {
                    if (
                        player.x <
                            platform.x +
                                platform.width &&
                        player.x + player.width >
                            platform.x &&
                        player.y +
                            player.height >=
                            platform.y &&
                        player.y +
                            player.height <=
                            platform.y +
                                platform.height &&
                        playerVelocityY > 0
                    ) {
                        setPlayer((prev) => ({
                            ...prev,
                            y:
                                platform.y -
                                PLAYER_HEIGHT,
                        }));
                        setPlayerVelocityY(0);
                        setIsJumping(false);
                    }
                });

                setScore((prev) => prev + 1);
            };

            gameLoopRef.current =
                requestAnimationFrame(
                    function gameLoop() {
                        updatePlatformerGame();
                        gameLoopRef.current =
                            requestAnimationFrame(
                                gameLoop
                            );
                    }
                );
        }

        return () => {
            if (gameLoopRef.current) {
                cancelAnimationFrame(
                    gameLoopRef.current
                );
            }
        };
    }, [
        currentGame,
        player,
        platforms,
        playerVelocityY,
        isJumping,
    ]);

    useEffect(() => {
        const handleKeyDown = (
            e: KeyboardEvent
        ) => {
            if (currentGame === 'pong') {
                if (
                    e.key === 'w' &&
                    leftPaddleY > 0
                ) {
                    setLeftPaddleY((prev) =>
                        Math.max(prev - 20, 0)
                    );
                } else if (
                    e.key === 's' &&
                    leftPaddleY <
                        GAME_HEIGHT -
                            PADDLE_HEIGHT
                ) {
                    setLeftPaddleY((prev) =>
                        Math.min(
                            prev + 20,
                            GAME_HEIGHT -
                                PADDLE_HEIGHT
                        )
                    );
                }

                if (
                    e.key === 'ArrowUp' &&
                    rightPaddleY > 0
                ) {
                    setRightPaddleY((prev) =>
                        Math.max(prev - 20, 0)
                    );
                } else if (
                    e.key === 'ArrowDown' &&
                    rightPaddleY <
                        GAME_HEIGHT -
                            PADDLE_HEIGHT
                ) {
                    setRightPaddleY((prev) =>
                        Math.min(
                            prev + 20,
                            GAME_HEIGHT -
                                PADDLE_HEIGHT
                        )
                    );
                }
            } else {
                if (
                    e.code === 'Space' &&
                    !isJumping
                ) {
                    setPlayerVelocityY(
                        -JUMP_FORCE
                    );
                    setIsJumping(true);
                }
            }
        };

        window.addEventListener(
            'keydown',
            handleKeyDown
        );

        return () => {
            window.removeEventListener(
                'keydown',
                handleKeyDown
            );
        };
    }, [
        currentGame,
        leftPaddleY,
        rightPaddleY,
        isJumping,
    ]);

    const resetPongBall = () => {
        const newX = GAME_WIDTH / 2;
        const newY = GAME_HEIGHT / 2;
        setBallX(newX);
        setBallY(newY);
        setBallSpeedX((prev) =>
            Math.random() > 0.5 ? 3 : -3
        );
        setBallSpeedY(
            (prev) => (Math.random() * 2 - 1) * 3
        );
        return { x: newX, y: newY };
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
            <nav className="mb-4">
                <button
                    onClick={() =>
                        setCurrentGame('pong')
                    }
                    className={`mr-4 px-4 py-2 rounded ${
                        currentGame === 'pong'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                    }`}
                >
                    Pong
                </button>
                <button
                    onClick={() =>
                        setCurrentGame(
                            'platformer'
                        )
                    }
                    className={`px-4 py-2 rounded ${
                        currentGame ===
                        'platformer'
                            ? 'bg-blue-500'
                            : 'bg-gray-500'
                    }`}
                >
                    Platformer
                </button>
            </nav>

            {currentGame === 'pong' ? (
                <>
                    <div className="mb-4 text-2xl">
                        {leftScore} - {rightScore}
                    </div>
                    <div
                        className="relative"
                        style={{
                            width: GAME_WIDTH,
                            height: GAME_HEIGHT,
                            border: '2px solid white',
                        }}
                    >
                        <div
                            className="absolute bg-white"
                            style={{
                                left: 0,
                                top: leftPaddleY,
                                width: PADDLE_WIDTH,
                                height: PADDLE_HEIGHT,
                            }}
                        />
                        <div
                            className="absolute bg-white"
                            style={{
                                right: 0,
                                top: rightPaddleY,
                                width: PADDLE_WIDTH,
                                height: PADDLE_HEIGHT,
                            }}
                        />
                        <div
                            className="absolute bg-white rounded-full"
                            style={{
                                left: ballX,
                                top: ballY,
                                width: BALL_SIZE,
                                height: BALL_SIZE,
                            }}
                        />
                    </div>
                    <div className="mt-4 text-lg">
                        Left player: W (up) and S
                        (down) | Right player: ↑
                        and ↓ arrows
                    </div>
                </>
            ) : (
                <>
                    <div className="mb-4 text-2xl">
                        Score: {score}
                    </div>
                    <div
                        className="relative"
                        style={{
                            width: GAME_WIDTH,
                            height: GAME_HEIGHT,
                            border: '2px solid white',
                        }}
                    >
                        {/* Player */}
                        <div
                            className="absolute bg-blue-500"
                            style={{
                                left: player.x,
                                top: player.y,
                                width: player.width,
                                height: player.height,
                            }}
                        />
                        {/* Platforms */}
                        {platforms.map(
                            (platform, index) => (
                                <div
                                    key={index}
                                    className="absolute bg-green-500"
                                    style={{
                                        left: platform.x,
                                        top: platform.y,
                                        width: platform.width,
                                        height: platform.height,
                                    }}
                                />
                            )
                        )}
                    </div>
                    <div className="mt-4 text-lg">
                        Press Space to jump
                    </div>
                </>
            )}
        </div>
    );
}
