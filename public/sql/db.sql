-- DB_GOODBUY
DROP DATABASE DB_GOODBUY;
CREATE DATABASE DB_GOODBUY;
USE DB_GOODBUY;

DROP TABLE TBL_USER;
CREATE TABLE TBL_USER(
   U_NO                     INT AUTO_INCREMENT,
   U_ID                     VARCHAR(20) UNIQUE,
   U_PW                     VARCHAR(100) NOT NULL,
   U_PROFILE_THUM          VARCHAR(50),
   U_NICK                  VARCHAR(20) UNIQUE,
   U_PHONE                 VARCHAR(20) NOT NULL,
   U_SEX                  VARCHAR(2) NOT NULL,               -- M(남) W(여)
   U_AGE                  VARCHAR(10) NOT NULL,               -- 연령대
   U_POST_ADDRESS          VARCHAR(100) NOT NULL,               -- 우편번호 주소
   U_DETAIL_ADDRESS       VARCHAR(50),                        -- 상세 주소
   U_SNS_ID               VARCHAR(30),                        -- 구글, 네이버 ID
   U_ACTIVE               TINYINT DEFAULT 1,                  -- 0(삭제된 계정), 1(활동중인 계정), 2(정지된 계정)
   U_CLASS                 TINYINT DEFAULT 1,                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
   U_POINT                 SMALLINT DEFAULT 100,               -- 100점 획득시 등급 상승
   U_PENALTY               TINYINT DEFAULT 0,                  -- 잔여 페널티(3패널티에 1일 정지)
   U_BAN_START_DATE       DATETIME,                            -- 정지 시작 날짜
    U_BAN_END_DATE          DATETIME,                           -- 정지 종료 날짜
   U_REG_DATE               DATETIME DEFAULT NOW(),
   U_MOD_DATE               DATETIME DEFAULT NOW(),
   PRIMARY KEY(U_NO)
);
SELECT * FROM TBL_USER;

DROP TABLE TBL_ADMIN;
CREATE TABLE TBL_ADMIN(
   A_NO                     INT AUTO_INCREMENT,
   A_ID                     VARCHAR(20) UNIQUE,
   A_PW                     VARCHAR(100) NOT NULL,
   A_MAIL                  VARCHAR(20) NOT NULL,
   A_PHONE                 VARCHAR(20) NOT NULL,
   A_PROFILE_THUM            VARCHAR(50),
   A_ROLE                  VARCHAR(20) DEFAULT 'PRE_ADMIN',      -- 1(PRE_ADMIN), 2(ADMIN), 3(SUPER_ADMIN)
   A_REG_DATE                DATETIME DEFAULT NOW(),
   A_MOD_DATE                DATETIME DEFAULT NOW(),
   PRIMARY KEY(A_NO)
);
SELECT * FROM TBL_ADMIN;

DROP TABLE TBL_PRODUCT;
CREATE TABLE TBL_PRODUCT(
   P_NO               INT AUTO_INCREMENT,
   P_OWNER_ID            VARCHAR(20) NOT NULL,
   P_OWNER_NICK         VARCHAR(20) NOT NULL,
    P_CATEGORY            VARCHAR(20) NOT NULL,
    P_IMAGE               VARCHAR(50) NOT NULL,
   P_NAME               VARCHAR(100) NOT NULL,
   P_DESC               TEXT NOT NULL,
   P_PRICE               INT NOT NULL,
   P_STATE               TINYINT DEFAULT 3,                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
    P_TRADE_DATE         DATETIME,
   P_REG_DATE            DATETIME DEFAULT NOW(),
   P_MOD_DATE            DATETIME DEFAULT NOW(),

   PRIMARY KEY(P_NO)
);
SELECT * FROM TBL_PRODUCT;

DROP TABLE TBL_SALE;
CREATE TABLE TBL_SALE(
   S_NO               INT AUTO_INCREMENT,
   S_PRODUCT_NO         INT NOT NULL,
   S_SELLER_ID            VARCHAR(20) NOT NULL,
   S_SELLER_NICK         VARCHAR(20) NOT NULL,
   S_BUYER_ID            VARCHAR(20),
   S_BUYER_NICK         VARCHAR(20),
   S_TRADE_DATE         DATETIME,
   S_STATE               TINYINT,                     -- 0(삭제), 1(취소), 2(완료), 3(판매 중)
   S_REG_DATE            DATETIME DEFAULT NOW(),
   S_MOD_DATE            DATETIME DEFAULT NOW(),

   PRIMARY KEY(S_NO)
);
SELECT * FROM TBL_SALE;

DROP TABLE TBL_AUCTION;
CREATE TABLE TBL_AUCTION(

   AU_NO               INT AUTO_INCREMENT,
   AU_PRODUCT_NO         INT NOT NULL,
   AU_SELLER_ID         VARCHAR(20) NOT NULL,
   AU_SELLER_NICK         VARCHAR(20) NOT NULL,
   AU_BUYER_ID            VARCHAR(20),
   AU_BUYER_NICK         VARCHAR(20),
   AU_PRICE            INT,
   AU_TRADE_DATE         DATETIME,
   AU_STATE            TINYINT,                     -- 0(삭제), 1(취소), 2(완료), 4(경매중)
   AU_REG_DATE            DATETIME DEFAULT NOW(),
   AU_MOD_DATE            DATETIME DEFAULT NOW(),

   PRIMARY KEY(AU_NO)
);
SELECT * FROM TBL_AUCTION;

DROP TABLE TBL_CHAT;
CREATE TABLE TBL_CHAT(
	CH_NO                  INT AUTO_INCREMENT,
	CH_SENDER_ID            VARCHAR(20) NOT NULL,
    CH_SENDER_NICK         VARCHAR(20) NOT NULL,
	CH_RECEIVER_ID          VARCHAR(20) NOT NULL,
    CH_RECEIVER_NICK      VARCHAR(20) NOT NULL,
    CH_PRODUCT_NO         INT NOT NULL,
    CH_TITLE               VARCHAR(50),            -- 마지막 M_CONTENT
	CH_UNREAD_COUNT 		INT DEFAULT 0,
	CH_ACTIVE               TINYINT DEFAULT 1,                  -- 0(DELETE), 1(BOTH), 2(SENDERID만), 3(RECEIVERID만)
    CH_SENDER_LAST_EXIT_TIME 	DATETIME DEFAULT NULL,
    CH_RECEIVER_LAST_EXIT_TIME 	DATETIME DEFAULT NULL,
	CH_TIME                   DATETIME DEFAULT NOW(),
   PRIMARY KEY(CH_NO)
);
SELECT * FROM TBL_CHAT;

DROP TABLE TBL_MESSAGE;
CREATE TABLE TBL_MESSAGE(
	M_NO                  INT AUTO_INCREMENT,
	M_CHAT_CH_NO      INT NOT NULL,            -- CH_NO
	M_SENDER_ID         VARCHAR(20) NOT NULL,
	M_SENDER_NICK       VARCHAR(20) NOT NULL,
	M_RECEIVER_ID       VARCHAR(20) NOT NULL,
	M_RECEIVER_NICK      VARCHAR(20) NOT NULL,
	M_CONTENT           TEXT,
    M_UNREAD_COUNT		TINYINT DEFAULT 1,
	M_TIME            DATETIME DEFAULT NOW(),
   PRIMARY KEY(M_NO)
);
SELECT * FROM TBL_MESSAGE;

DROP TABLE TBL_CHAT_IMAGE;
CREATE TABLE TBL_CHAT_IMAGE(
   CI_NO                  INT AUTO_INCREMENT,
   CI_CH_NO               INT   NOT NULL,
   CI_FILE                  VARCHAR(100) NOT NULL,
   PRIMARY KEY(CI_NO)
);
SELECT * FROM TBL_CHAT_IMAGE;

DROP TABLE TBL_PRODUCT_IMAGE;
CREATE TABLE TBL_PRODUCT_IMAGE(
   PI_NO                  INT AUTO_INCREMENT,
   PI_CH_NO               INT   NOT NULL,
   PI_FILE                  VARCHAR(100) NOT NULL,
   PRIMARY KEY(PI_NO)
);
SELECT * FROM TBL_PRODUCT_IMAGE;

DROP TABLE TBL_CATEGORY;
CREATE TABLE TBL_CATEGORY(
   C_NO                     INT AUTO_INCREMENT,
   C_NAME                  VARCHAR(20),
   PRIMARY KEY(C_NO)
);
SELECT * FROM TBL_CATEGORY;

DROP TABLE TBL_ACTIVE;
CREATE TABLE TBL_ACTIVE(
   AC_NO                  INT AUTO_INCREMENT,
   AC_NAME                  VARCHAR(20),                  -- 0(삭제) 1(정지), 2(활동)
   PRIMARY KEY(AC_NO)
);
SELECT * FROM TBL_ACTIVE;

DROP TABLE TBL_CLASS;
CREATE TABLE TBL_CLASS(
   CL_NO                  INT AUTO_INCREMENT,
   CL_NAME                  VARCHAR(20),                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
   PRIMARY KEY(CL_NO)
);
SELECT * FROM TBL_CLASS;

DROP TABLE TBL_STATE;
CREATE TABLE TBL_STATE(
   ST_NO                  INT AUTO_INCREMENT,
   ST_NAME                  VARCHAR(20),                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
   PRIMARY KEY(ST_NO)
);
SELECT * FROM TBL_STATE;

DROP TABLE TBL_WISHLIST;
CREATE TABLE TBL_WISHLIST(
   W_NO INT AUTO_INCREMENT,
    W_USER_NO INT NOT NULL,                                -- 사용자 ID (TBL_USER의 U_NO와 연관)
    W_PRODUCT_NO INT NOT NULL,                             -- 상품 ID (TBL_PRODUCT의 P_NO와 연관)
    W_REG_DATE DATETIME DEFAULT NOW(),
    W_MOD_DATE DATETIME DEFAULT NOW(),
    PRIMARY KEY(W_NO)
);
SELECT * FROM TBL_WISHLIST;

DROP TABLE TBL_EVENT;
CREATE TABLE TBL_EVENT (
    E_NO INT AUTO_INCREMENT,                                -- 이벤트 ID
    E_TITLE VARCHAR(100) NOT NULL,                          -- 이벤트 제목
    E_IMAGE VARCHAR(255) NOT NULL,                          -- 이벤트 이미지
    E_URL VARCHAR(255),                                    -- 이벤트 URL
    E_DESC TEXT,                                            -- 이벤트 설명 (선택적)
    E_ACTIVE TINYINT DEFAULT 1,                              -- 0(DELETE), 1(ACTIVE), 2(STOP)
    E_START_DATE DATETIME,                                  -- 이벤트 시작 날짜
    E_END_DATE DATETIME,                                    -- 이벤트 종료 날짜
    E_REG_DATE DATETIME DEFAULT NOW(),                      -- 등록 날짜
    E_MOD_DATE DATETIME DEFAULT NOW(),                      -- 수정 날짜
    PRIMARY KEY (E_NO)
);
SELECT * FROM TBL_EVENT;


SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

INSERT INTO TBL_STATE VALUES(0,'삭제');
INSERT INTO TBL_STATE (ST_NAME) VALUES('취소');
INSERT INTO TBL_STATE (ST_NAME) VALUES('완료');
INSERT INTO TBL_STATE (ST_NAME) VALUES('판매');
INSERT INTO TBL_STATE (ST_NAME) VALUES('경매');

INSERT INTO TBL_CLASS VALUES(0,'UNRANK');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('IRON');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('BRONZE');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('SILVER');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('GOLD');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('PLATINUM');
INSERT INTO TBL_CLASS (CL_NAME) VALUES('DIAMOND');

INSERT INTO TBL_CATEGORY VALUES(0,'전체');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('수입명품');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('패션의류');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('패션잡화');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('뷰티');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('출산/유아동');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('모바일/태블릿');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('노트북/PC');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('카메라/캠코더');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('가구/인테리어');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('리빙/생활');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('게임');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('반려동물/취미');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('도서/음반/문구');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('티켓/쿠폰');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('스포츠');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('레저/여행');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('오토바이');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('공구/산업용품');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('무료나눔');
INSERT INTO TBL_CATEGORY (C_NAME) VALUE('중고차');


INSERT INTO TBL_ACTIVE VALUES(0,'삭제');
INSERT INTO TBL_ACTIVE(AC_NAME) VALUES('활성');
INSERT INTO TBL_ACTIVE(AC_NAME) VALUES('비활성');

DELIMITER $$
CREATE TRIGGER AFTER_INSERT_MESSAGE
AFTER INSERT ON TBL_MESSAGE
FOR EACH ROW
BEGIN
    -- 새로운 메시지가 추가될 때마다 CH_UNREAD_COUNT를 증가
    UPDATE TBL_CHAT 
    SET CH_UNREAD_COUNT = CH_UNREAD_COUNT + 1, 
        CH_TITLE = NEW.M_CONTENT
    WHERE CH_NO = NEW.M_CHAT_CH_NO;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER UPDATE_POINT_ADD AFTER INSERT ON TBL_PRODUCT
FOR EACH ROW
BEGIN
UPDATE TBL_USER SET U_POINT = U_POINT + 1 WHERE U_ID = NEW.P_OWNER_ID;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER UPDATE_POINT_UPDATE AFTER UPDATE ON TBL_PRODUCT
FOR EACH ROW
BEGIN
IF NEW.P_STATE <= 1 THEN
UPDATE TBL_USER SET U_POINT = U_POINT - 1 WHERE U_ID = NEW.P_OWNER_ID;
ELSEIF NEW.P_STATE = 2 THEN
UPDATE TBL_USER SET U_POINT = U_POINT + 1 WHERE U_ID = NEW.P_OWNER_ID;
END IF;
END $$
DELIMITER ;


DELIMITER $$
CREATE TRIGGER ADD_PRODUCT AFTER INSERT ON TBL_PRODUCT
FOR EACH ROW
BEGIN
IF NEW.P_STATE = 3 THEN
INSERT INTO TBL_SALE (S_PRODUCT_NO, S_SELLER_ID, S_SELLER_NICK) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK);
ELSEIF NEW.P_STATE = 4 THEN
INSERT INTO TBL_AUCTION (AU_PRODUCT_NO, AU_SELLER_ID, AU_SELLER_NICK, AU_PRICE, AU_TRADE_DATE) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK, NEW.P_PRICE, NEW.P_TRADE_DATE);
END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER UPDATE_CLASS BEFORE UPDATE ON TBL_USER
FOR EACH ROW
BEGIN
IF NEW.U_POINT >= 700 THEN
SET NEW.U_POINT = NEW.U_POINT;
ELSEIF NEW.U_POINT >= 600 AND NEW.U_CLASS = 5 THEN
SET NEW.U_CLASS = OLD.U_CLASS + 1;
SET NEW.U_POINT = NEW.U_POINT - 600;
ELSEIF NEW.U_POINT >= 500 AND NEW.U_CLASS = 4  THEN
SET NEW.U_CLASS = OLD.U_CLASS + 1;
SET NEW.U_POINT = NEW.U_POINT - 500;
ELSEIF NEW.U_POINT >= 400 AND NEW.U_CLASS = 3  THEN
SET NEW.U_CLASS = OLD.U_CLASS + 1;
SET NEW.U_POINT = NEW.U_POINT - 400;
ELSEIF NEW.U_POINT >= 300 AND NEW.U_CLASS = 2  THEN
SET NEW.U_CLASS = OLD.U_CLASS + 1;
SET NEW.U_POINT = NEW.U_POINT - 300;
ELSEIF NEW.U_POINT >= 200 AND NEW.U_CLASS = 1  THEN
SET NEW.U_CLASS = OLD.U_CLASS + 1;
SET NEW.U_POINT = NEW.U_POINT - 200;
END IF;
END $$
DELIMITER ;

DELIMITER $$
CREATE TRIGGER CHANGE_STATE AFTER UPDATE ON TBL_PRODUCT
FOR EACH ROW
BEGIN
IF OLD.P_STATE = 3 AND NEW.P_STATE = 4 THEN
DELETE FROM TBL_SALE WHERE S_PRODUCT_NO = NEW.P_NO;
INSERT INTO TBL_AUCTION (AU_PRODUCT_NO, AU_SELLER_ID, AU_SELLER_NICK, AU_PRICE, AU_TRADE_DATE, AU_STATE) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK, NEW.P_PRICE, NEW.P_TRADE_DATE, NEW.P_STATE);
ELSEIF OLD.P_STATE = 4 AND NEW.P_STATE =3 THEN
DELETE FROM TBL_AUCTION WHERE AU_PRODUCT_NO = NEW.P_NO;
INSERT INTO TBL_SALE (S_PRODUCT_NO, S_SELLER_ID, S_SELLER_NICK, S_STATE) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK, NEW.P_STATE);
END IF;
END $$
DELIMITER ;

show triggers;
INSERT INTO TBL_ACTIVE(AC_NAME) VALUES('비활성');
