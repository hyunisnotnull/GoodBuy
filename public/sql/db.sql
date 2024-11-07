-- DB_GOODBUY
DROP DATABASE IF EXISTS DB_GOODBUY;
CREATE DATABASE DB_GOODBUY;
USE DB_GOODBUY;

DROP TABLE IF EXISTS TBL_USER;
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

DROP TABLE IF EXISTS TBL_ADMIN;
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

DROP TABLE IF EXISTS TBL_PRODUCT;
CREATE TABLE TBL_PRODUCT(
   P_NO               INT AUTO_INCREMENT,
   P_OWNER_ID            VARCHAR(20) NOT NULL,
   P_OWNER_NICK         VARCHAR(20) NOT NULL,
   P_CATEGORY            VARCHAR(20) NOT NULL,
   P_IMAGE_NO               INT,
   P_NAME               VARCHAR(100) NOT NULL,
   P_DESC               TEXT NOT NULL,
   P_PRICE               INT NOT NULL,
   P_STATE               TINYINT DEFAULT 3,                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중), 5(위반)
    P_TRADE_DATE         DATETIME,
   P_REG_DATE            DATETIME DEFAULT NOW(),
   P_MOD_DATE            DATETIME DEFAULT NOW(),

   PRIMARY KEY(P_NO)
);
SELECT * FROM TBL_PRODUCT;

DROP TABLE IF EXISTS TBL_SALE;
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

DROP TABLE IF EXISTS TBL_AUCTION;
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
   AU_CNT				  INT,
   AU_REG_DATE            DATETIME DEFAULT NOW(),
   AU_MOD_DATE            DATETIME DEFAULT NOW(),
   PRIMARY KEY(AU_NO)
);
SELECT * FROM TBL_AUCTION;

DROP TABLE IF EXISTS TBL_CHAT;
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

DROP TABLE IF EXISTS TBL_MESSAGE;
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

DROP TABLE IF EXISTS TBL_CHAT_IMAGE;
CREATE TABLE TBL_CHAT_IMAGE(
   CI_NO                  INT AUTO_INCREMENT,
   CI_MESSAGE_M_NO        INT NOT NULL,        	  -- 메시지 번호 (TBL_MESSAGE의 M_NO)
   CI_FILE                VARCHAR(100) NOT NULL,  -- 이미지 파일 경로
   PRIMARY KEY(CI_NO),
   FOREIGN KEY (CI_MESSAGE_M_NO) REFERENCES TBL_MESSAGE(M_NO) ON DELETE CASCADE
);
SELECT * FROM TBL_CHAT_IMAGE;

DROP TABLE IF EXISTS TBL_PRODUCT_IMAGE;
CREATE TABLE TBL_PRODUCT_IMAGE(
   PI_NO                  INT AUTO_INCREMENT,
   PI_P_NO               INT   NOT NULL,
   PI_FILE                  VARCHAR(100) NOT NULL,
   PRIMARY KEY(PI_NO)
);
SELECT * FROM TBL_PRODUCT_IMAGE;

DROP TABLE IF EXISTS TBL_CHECK;
CREATE TABLE TBL_CHECK(
   CK_NO                     INT AUTO_INCREMENT,
   CK_NAME                  VARCHAR(20),                       -- 0(신고), 1(승인, 신고자+1, 게시물주인 -1), 2(반려, 신고자 -1)
   PRIMARY KEY(CK_NO)
);
SELECT * FROM TBL_CHECK;

DROP TABLE IF EXISTS TBL_CATEGORY;
CREATE TABLE TBL_CATEGORY(
   C_NO                     INT AUTO_INCREMENT,
   C_NAME                  VARCHAR(20),
   PRIMARY KEY(C_NO)
);
SELECT * FROM TBL_CATEGORY;

DROP TABLE IF EXISTS TBL_ACTIVE;
CREATE TABLE TBL_ACTIVE(
   AC_NO                  INT AUTO_INCREMENT,
   AC_NAME                  VARCHAR(20),                  -- 0(삭제) 1(정지), 2(활동)
   PRIMARY KEY(AC_NO)
);
SELECT * FROM TBL_ACTIVE;

DROP TABLE IF EXISTS TBL_CLASS;
CREATE TABLE TBL_CLASS(
   CL_NO                  INT AUTO_INCREMENT,
   CL_NAME                  VARCHAR(20),                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
   PRIMARY KEY(CL_NO)
);
SELECT * FROM TBL_CLASS;

DROP TABLE IF EXISTS TBL_STATE;
CREATE TABLE TBL_STATE(
   ST_NO                  INT AUTO_INCREMENT,
   ST_NAME                  VARCHAR(20),                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
   PRIMARY KEY(ST_NO)
);
SELECT * FROM TBL_STATE;

DROP TABLE IF EXISTS TBL_WISHLIST;
CREATE TABLE TBL_WISHLIST(
   W_NO INT AUTO_INCREMENT,
   W_USER_NO INT NOT NULL,                                -- 사용자 ID (TBL_USER의 U_NO와 연관)
   W_PRODUCT_NO INT NOT NULL,                             -- 상품 ID (TBL_PRODUCT의 P_NO와 연관)
   W_REG_DATE DATETIME DEFAULT NOW(),
   W_MOD_DATE DATETIME DEFAULT NOW(),
   PRIMARY KEY(W_NO)
);
SELECT * FROM TBL_WISHLIST;

DROP TABLE IF EXISTS TBL_EVENT;
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

DROP TABLE IF EXISTS TBL_REPORT;
CREATE TABLE TBL_REPORT(
   R_NO INT AUTO_INCREMENT,
   R_P_NO INT NOT NULL,
   R_U_NO INT NOT NULL,
    R_CHECK TINYINT DEFAULT 0,									-- 0(신고), 1(승인), 2(반려)
    R_REG_DATE DATETIME DEFAULT NOW(),
    R_MOD_DATE DATETIME DEFAULT NOW(),
   PRIMARY KEY(R_NO)
);
SELECT * FROM TBL_REPORT;

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

INSERT INTO TBL_CHECK VALUES(0,'신고');
INSERT INTO TBL_CHECK (CK_NAME) VALUES('승인');
INSERT INTO TBL_CHECK (CK_NAME) VALUES('반려');

INSERT INTO TBL_STATE VALUES(0,'삭제');
INSERT INTO TBL_STATE (ST_NAME) VALUES('취소');
INSERT INTO TBL_STATE (ST_NAME) VALUES('완료');
INSERT INTO TBL_STATE (ST_NAME) VALUES('판매');
INSERT INTO TBL_STATE (ST_NAME) VALUES('경매');
INSERT INTO TBL_STATE (ST_NAME) VALUES('위반');

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

DROP TRIGGER IF EXISTS AFTER_INSERT_MESSAGE;
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

DROP TRIGGER IF EXISTS UPDATE_POINT_ADD;
DELIMITER $$
CREATE TRIGGER UPDATE_POINT_ADD AFTER INSERT ON TBL_PRODUCT
FOR EACH ROW
BEGIN
UPDATE TBL_USER SET U_POINT = U_POINT + 1 WHERE U_ID = NEW.P_OWNER_ID;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS UPDATE_POINT_UPDATE;
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

DROP TRIGGER IF EXISTS ADD_PRODUCT;
DELIMITER $$
CREATE TRIGGER ADD_PRODUCT AFTER INSERT ON TBL_PRODUCT
FOR EACH ROW
BEGIN
IF NEW.P_STATE = 3 THEN
INSERT INTO TBL_SALE (S_PRODUCT_NO, S_SELLER_ID, S_SELLER_NICK, S_STATE) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK, NEW.P_STATE);
ELSEIF NEW.P_STATE = 4 THEN
INSERT INTO TBL_AUCTION (AU_PRODUCT_NO, AU_SELLER_ID, AU_SELLER_NICK, AU_PRICE, AU_TRADE_DATE, AU_STATE) VALUES(NEW.P_NO, NEW.P_OWNER_ID, NEW.P_OWNER_NICK, NEW.P_PRICE, NEW.P_TRADE_DATE, NEW.P_STATE);
END IF;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS UPDATE_CLASS;
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

DROP TRIGGER IF EXISTS CHANGE_STATE;
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

DROP TRIGGER IF EXISTS DISABLE_DUPLICATE;
DELIMITER $$
CREATE TRIGGER DISABLE_DUPLICATE BEFORE INSERT ON TBL_WISHLIST
FOR EACH ROW
BEGIN
DECLARE RESULT INT;
SELECT COUNT(*) CNT INTO RESULT FROM TBL_WISHLIST WHERE W_USER_NO = NEW.W_USER_NO AND W_PRODUCT_NO = NEW.W_PRODUCT_NO;
IF (RESULT > 0) THEN
SIGNAL SQLSTATE '45000'
SET MESSAGE_TEXT = '이미 찜한 상품입니다.';
END IF;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS WISHLIST_POINT_ADD;
DELIMITER $$
CREATE TRIGGER WISHLIST_POINT_ADD AFTER INSERT ON TBL_WISHLIST
FOR EACH ROW
BEGIN
UPDATE TBL_USER SET U_POINT = U_POINT + 1 WHERE U_NO = NEW.W_USER_NO;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS WISHLIST_POINT_SUB;
DELIMITER $$
CREATE TRIGGER WISHLIST_POINT_SUB AFTER DELETE ON TBL_WISHLIST
FOR EACH ROW
BEGIN
UPDATE TBL_USER SET U_POINT = U_POINT - 1 WHERE U_NO = OLD.W_USER_NO;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS AUCTION_PRODUCT_PRICE_UPDATE;
DELIMITER $$
CREATE   TRIGGER AUCTION_PRODUCT_PRICE_UPDATE AFTER UPDATE ON TBL_AUCTION
FOR EACH ROW
BEGIN
UPDATE TBL_PRODUCT SET P_PRICE = NEW.AU_PRICE WHERE P_NO = NEW.AU_PRODUCT_NO;
END $$
DELIMITER ;

DROP TRIGGER IF EXISTS CHANGE_PENALTY;
DELIMITER $$
CREATE TRIGGER CHANGE_PENALTY AFTER UPDATE ON TBL_REPORT
FOR EACH ROW
BEGIN
DECLARE T_ID VARCHAR(20);
IF NEW.R_CHECK = 1 THEN
UPDATE TBL_USER SET U_POINT = U_POINT + 1 WHERE U_NO = NEW.R_U_NO;
SELECT P_OWNER_ID INTO T_ID FROM TBL_PRODUCT WHERE NEW.R_P_NO = P_NO;
UPDATE TBL_USER SET U_POINT = U_POINT - 1, U_PENALTY = U_PENALTY + 1 WHERE U_ID = T_ID;
ELSEIF NEW.R_CHECK = 2 THEN
UPDATE TBL_USER SET U_POINT = U_POINT - 1 WHERE U_NO = NEW.R_U_NO;
END IF;
END $$
DELIMITER ;


SELECT * FROM TBL_PRODUCT_IMAGE;
INSERT INTO TBL_PRODUCT_IMAGE (PI_P_NO, PI_FILE)
VALUES
(1, '1664779091864zd3_QZUB3.jpg'),
(2, '1729564861572_000_vAAWB_main.jpg'),
(3,  '1729831598568FXy_ytW8C.jpg'),
(4, '1729132713539l8s_E5rCJ.jpg'),
(5, '1683678974278csD_Jq3xH.jpg'),
(6, '1727843032781Bo5_swndj.jpg'),
(7, '1727883384480lJK_kFSkR.jpg'),
(8, '1583069496910dPE_2xlTi.jpg'),
(9,  '1730383414580Ofu_CHO67.jpg'),
(10, '1730384281228_000_Vxc7Q_main.jpg'),
(11, '1730384944116Dt7_Tg480.jpg'),
(12,'17303839855166sa_0WuUz.jpg'),
(13,'1722431827999_000_4ACmI_main.jpg'),
(14, '173038501160162U_LExPc.jpg'),
(15, '1730383522734v4r_Y0KxO.jpg'),
(16,'1722683795807HRS_VXWke.jpg'),
(17,'1730112397316KyF_G0aGY.jpg'),
(18,'1681095021165yAF_CZuyQ.jpg'),
(19, '1730384114823WhJ_tOKyJ.jpg'),
(20, '1711186022947PGc_siBHa.jpg'),
(21, '1717173907835_000_xRfYy_main.jpg'),
(22,'1730132609818IAY_6NxxI.jpg'),
(23, '1730385242103DJW_UUYK8.jpg'),
(24, '1730385412211xIV_fku5g.jpg'),
(25,'1730075476971DMh_Dn1ev.jpg'),
(26, '1730383974278_000_nhsFu_main.jpg'),
(27, '1730385533658NCA_NruQy.jpg'),
(28, '1730383325466xM9_HYGdV.jpg'),
(29, '1730385625265_000_HNXPa_main.jpg'),
(30, '1717231901756X25_wEGC1.jpg'),
(31, '1730385469936_000_EoJlW_main.JPG'),
(32, '1730385458320v2w_wCoAO.jpg'),
(33, '1728306024782UKD_WQjA0.jpg'),
(34, '1730343196273TuZ_TSLly.jpg'),
(35, '1730384016911dW6_2vV1D.jpg'),
(36,'1730383079074_000_s9sem_main.png'),
(37,'17188075906553e7_mAxV6.jpg'),
(38, '1730385932279_000_97eZ4_main.jpg'),
(39,'1730386131551Sb4_Io9V6.jpg'),
(40, '1730386151738BL0_tRzKr.jpg'),
(41, '1730385455331sAJ_kroqU.jpg'),
(42,'1730385468428HBz_9GztO.jpg' ),
(43,'17303834774557ha_Qtn0H.jpg' ),
(44,'1730386397328rfd_S8Jt8.jpg' ),
(45,'1730017564097QC3_VUeTR.jpg' ),
(46, '1721875668142_000_dz6RJ_main.jpg'),
(47,'1721031811719hNr_hlchy.jpg' ),
(48,'1730386676914RXd_0SIMz.jpg' ),
(49,'17303864921164lO_bGXz8.jpg' ),
(50, '1730386871965gFB_52obY.jpg');


SELECT * FROM TBL_USER;
INSERT INTO TBL_USER (U_ID, U_PW, U_NICK, U_PHONE, U_SEX, U_AGE, U_POST_ADDRESS, U_PROFILE_THUM)
VALUES
('gildong@gmail.com','$2b$10$ENW7A8w25vDYCtgN42GL7uGReBwUoPnJzg8FvngAG5kMGnItTCZjO','gildong', '010-0000-0000', 'M', '20', '[11683] 경기 의정부시 가능로97번길 35 고려연립 (가능동)', '1664779091864zd3_QZUB3.jpg'),
('chanho@naver.com','$2b$10$ENW7A8w25vDYCtgN42GL7uGReBwUoPnJzg8FvngAG5kMGnItTCZjO','chanho', '010-1111-1111', 'M', '30', '[11797] 경기 의정부시 송산로 1089 교정아파트 (고산동)', '1730384944116Dt7_Tg480.jpg'),
('seri@nate.com','$2b$10$ENW7A8w25vDYCtgN42GL7uGReBwUoPnJzg8FvngAG5kMGnItTCZjO','seri', '010-2222-2222', 'F', '40', '[11752] 경기 의정부시 부용로95번길 25 현대아이파크아파트 (금오동)', '1717173907835_000_xRfYy_main.jpg'),
('sunny@daum.net','$2b$10$ENW7A8w25vDYCtgN42GL7uGReBwUoPnJzg8FvngAG5kMGnItTCZjO','sunny', '010-3333-3333', 'F', '20', '[11769] 경기 의정부시 용민로 263 의정부민락금강펜테리움아파트 (낙양동)', '1730385469936_000_EoJlW_main.JPG'),
('yuri@gmail.com','$2b$10$ENW7A8w25vDYCtgN42GL7uGReBwUoPnJzg8FvngAG5kMGnItTCZjO','yuri', '010-4444-4444', 'F', '20', '[11607] 경기 의정부시 체육로 206 녹양대림아파트 (녹양동)', '1730385455331sAJ_kroqU.jpg');


SELECT * FROM TBL_PRODUCT;
INSERT INTO TBL_PRODUCT (P_OWNER_ID, P_OWNER_NICK, P_CATEGORY, P_IMAGE_NO, P_NAME, P_PRICE, P_DESC)
VALUES
('gildong@gmail.com', 'gildong', '5', 1, '할로윈 호박 가랜드 램프 전구 200cm마스크', 4000,'새 상품입니다.\n할로윈 호박 램프 에요.\n약 200cm 에요.\n9900원에 여러개 구매해서 등록해요.\n*새 건전지 AA 2개 같이 드려요.\n*휴대용 마스크 5매 같이 드려요\n귀엽고 호박등이 예뻐요.\n반품. 환불 어려워요.\n묶음배송비 4000입니다\n*gs 반값택배 2천원 이에요\n*발송전 후, 포장상태, 송장번호,\n*채팅 창에 올려드려요\n다른 상품과 묶음배송 으로 구매 하셔도 좋을것같아요. 3만원 배송비 무료입니다'),
('gildong@gmail.com', 'gildong', '5', 2, '(새상품)할로윈/파티복/할로윈코스튬/남아옷/왕자옷', 15000,'?? 제목에 ""제조사/ 브랜드 명""과 ""상품명”를 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n(무료배송) gs반값택배만 무료가능\n일반택배는 3.000원\n\n개봉해서 사진만 찍고 넣어둔 새상품입니다\n아이들 좋아하는 티니핑 비타민 캔디 같이 드려요♡\n\n할로윈의상으로 멋지며\n생일이벤트나 특별한날 파티행사때 쓰면 좋아요\n\n위아래 일체형 아니라서 입히기도 쉽고\n색상은 선명하고 재질도 좋아요\n\n5~6세 사이즈 되어있는데 사진 참고하세요\n\n네고.환불 안되니\n구매하실분만 톡 부탁 드립니다 ??\n\n필요하신분은 연락주세요 ^^'),
('gildong@gmail.com', 'gildong', '20', 3, '파인뷰 X500 FULL HD 2채널 중고 블랙박스', 75000, '	파인뷰 X500 FULL HD 2채널 중고 블랙박스입니다..\n\n전방 FULL HD/ 후방 FULL HD화질이고 메모리는 32G입니다..(외장GPS포함 금액이며 배선포함 완제품 구성입니다.)\n\nADAS/나이트비전/시크릿모드 기능등을 탑재한 제품입니다..\n\n전국 출장장착가능하며 장착비용은 문의바랍니다..\n\n문의 : 010 - 5967 - 2588(중고제품 특성상 생활기스 감안하시어 구매바랍니다...)\n\n방문거래는 대구시 동구 효목동에서 가능하며 택배거래는 로젠 택배로 발송합니다.\n(착불 3500원)\n\n@ 좋은 하루 되십시요 . 감사합니다^^'),
('gildong@gmail.com', 'gildong', '7', 4, '15.6인치 3D/게이밍 노트북/8GB', 229000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다'),
('gildong@gmail.com', 'gildong', '2', 5, '95 k2 케이투 정품 봄여름 자켓 남95 완전깨끗해요', 50000, '	하자없고 깨끗한 자켓 입니다\n봄여름 시원한 소재 작은구멍있으서 통풍 잘됩니다\n색감좋고 컨디션 아주좋아요 깔끔하게 입어세요\n텍사이즈 100지만 작게나와서 95가능사이즈 날씬한분 추천해요 실측참고하세요\n어깨 45\n가슴 52\n소매 64\n총기장 63\n입니다'),
('gildong@gmail.com', 'gildong', '3', 6, '나이키 x 스투시 베나시 슬라이드 슬리퍼 급처분', 90000, '	새상품 270mm 묻따 박스 O\n직거래 택배 가능'),
('gildong@gmail.com', 'gildong', '3', 7, '[265]미즈노 리벨리온 플래시 러닝화', 130000,'20km 미만, 실착 3회 입니다.\n\n쿨거시 택포 해드립니다 !'),
('gildong@gmail.com', 'gildong', '2', 8, '콜롬비아/후두패딩잠바/55/66', 25000, '	콜롬비아/후두패딩잠바/55/66\n\n55~날신66\n\n가슴:92cm 기장: 60cm?\n\n?소매:60cm\n\n간절기 패딩\n\n잠바모자 탈부착\n\n\n반품불가\n\n중고물품상? 신중구매바랍니다\n\n컴ㆍ해상도에따라 약간의 색상차이 있습니다\n\n010 3212 9251\n'),
('gildong@gmail.com', 'gildong', '18', 9, '[페스툴] 충전 이동식 집진기 CTLC MIDI I-B', 600000, '	[페스툴] 충전 이동식 집진기 CTLC MIDI I-Basic (577068) + 클리닝 세트\n\n\n페스툴 CTCL MIDI I-BASIC (577068)\n무선 집진기 베어툴\n\n+ 페스툴 크리닝 세트\nRS-HW D 36-Plus (577258)\n\n함께 판매 합니다.\n\n작업실 내 매립하여 사용해서 깨끗합니다.\n같은 집진기가 2개라 판매합니다.\n하자 전혀 없습니다.\n\n\n보증 완료 기간 : 2026년 5월 9일\n\n문의 주세요.\n\n\n충북 제천\n\n\n#페스툴 #집진기 #청소기 #무선'),
('gildong@gmail.com', 'gildong', '5', 10, '실바니안 단종아기 셋', 43000, '	잠자는 아기가 제일 양호하고 다는 두 아기는 조금씩 까잠이 보입니다..\n\n그래서 사진을 최대 가까이 찍었어요\n\n그래도 보고 있으면 표시안나고 예쁜 아이들입니다\n\n생각잘하시고 연락주세요..\n\n반품없이 cu 끼리반값 2000원 또는 택배비 3500원 입니다'),
('chanho@naver.com', 'chanho', '10', 11, '대림기업 미라텍 플러스 엔진오일5w40&엔진첨가제', 75000,'대림기업 미라텍 플러스 롱라이프 합성엔진오일 5w40 5리터 & 엔진첨가제 세트팝니다.\n\n오일 밀착성이 우수하며 윤활 기능과 산화방지성및 세정성 우수한 제품입니다.\n\n엔진보호 및 성능향상을 위한 특수첨가제가 함유되어 있으며 롱라이프 기능성 오일입니다.\n\n규격 5w40\n\n엔진오일 5리터 &엔진첨가제 세트\n\n세트금액 75,000원(무료배송)\n\n필요시 채팅주세요~~'),
('chanho@naver.com', 'chanho', '7', 12, '인텔 i5-13600k', 280000, '	인텔 i5-13600k 코잇 유통 국내정품 제품입니다\n박스는 없지만 AS는 28년 3월까지 가능하고 정품 스티커도 같이 드리겠습니다\n청담역 부근 직거래 가능합니다'),
('chanho@naver.com', 'chanho', '1', 13, '샤넬플랫 샤넬슈즈 플랫슈즈 명품슈즈플랫슈즈 로저비비에.', 100000,'샤넬정품 플랫슈즈입니다\n35반 사이즈입니다\n기본디자인에 뒤에샤넬포아트이뻐요\n여기저기 무난히 어울려요\n스크레치사용감있어 저렴히판매해요\n\n예민하신분사양해요\n\n\n\n※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 “상품명(ex. 숄더 핸드백)”을 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!'),
('chanho@naver.com', 'chanho', '12', 14, '[정품] 잔망루피 포켓형 스포티 키링', 3000, '	잔망루피 포켓형 스포티 키링 팝니다.\n수납이 가능하여 실용적인 아이입니다.\n모자 부분에 아주 미세한 오염이 있습니다.\n실착은 1-2번 했습니다.\n싸게 드리니 가져가세요~\n\n*제 프로필로 오시면 더 다양한 잔망루피 굿즈를 구경하실 수 있습니다.'),
('chanho@naver.com', 'chanho', '10', 15, '에어팟 프로 1세대', 90000, '	전체적인 사용감 있습니다.\n\n한 쪽 유닛 배터리가 조금 더 빨리 닳긴 하지만 큰 차이는 아니어서 충분히 장시간 사용 가능합니다.\n\n그 외에는 기능상 하자 없습니다.'),
('chanho@naver.com', 'chanho', '4', 16, '샤넬 넘버5 로 오드 뚜왈렛100ml 대용량', 68500,'샤넬 넘버5 로 오드 뚜왈렛\n100ml 대용량\n\n저희상점은 실제사진 사용합니다.\n도용 광고사진 NO!!\n\n\n\n샤넬 넘버5 로 오드뚜왈렛\n\n용량 100ml\n\n고퀄 프리미엄\n\n\n상기상품은 최신 해외 직구수입제품\n으로 해외현지샐러를 통해 사입후 소량 수량이 남아서 판매하며,\n제품은 미개봉 새상품 입니다.\n\n국내백화점상품 아닙니다.\n\n향수는 미개봉 제품은 5년 개봉후 3년 사용가능합니다\n\n상기상품은 해외 온 오프라인 사이트 및 국내 온라인 사이트 등에서도 판매중입니다.\n\n새상품으로 단아하고 우하한 파우더리향과 코튼향의 조합으로 셀럽들에게도 많은 사랑을 받는 제품입니다.\n\n사계절용이지만 봄 가을 많이 사용하며 청순한 여성들이\n주로 선호 합니다.\n\n배우 손예진씨 한가인씨 애착향수로 알려져 있습니다.\n\n배송은 최대한 안전포장후 진행합니다~~^^\n\n단순변심 교환환불은 불가능합니다.\n\n미세하자 외 심각한 파손등은 당연히 교환환불 가능합니다.\n\n미세한 부분에 많이 민감하시고 예민하신분은 앱에서 최저가 구매보다는 백화점에서 정가구매 부탁드립니다.\n\n\n마지막 사진 제조국 made in 프랑스\n조회 확인 가능합니다.\n인지후 주문 부탁드립니다 .\n구글에서 로트번호 조회가능합니다\n\n\n\n상품은 미개봉 새상품으로 발송되며\n평일 빠른택배 당일발송 처리가능합니다.\n\n\n\n할인가 65.000원 택비3500원'),
('chanho@naver.com', 'chanho', '6', 17, '애플워치 밴드 애플워치 손목 밴드 스트랩', 4000,'새상품입니다.\n직거래는 한국예술종합학교 혹은 의릉 근처나 돌곶이역 6번출구, 신이문역 1번출구 에서 가능합니다.\n반값택배, 일반택배 모두 가능합니다.'),
('chanho@naver.com', 'chanho', '2', 18, '(미사용)Victorious 청바지 36', 22000,'-에눌, 택포, 교신, 착샷 문의\n미리 사양합니다\n서로 시간 아껴요\n\n제주산간 제외 배송비 3300원\n직거래 용산전자랜드 근처 (이동X)\n씨유 반값택배 가능\n지에스 X\n\n허리단면 46\n총장 105 밑위 26\n허벅지 32 밑단 23cm\n실측 잘 확인하시고 연락주세요\n\n진청\n스판 X\n100%코튼 데님\n루즈 스트레이트핏\n\n택가격 150$\n\n수선X\n미사용 새상품'),
('chanho@naver.com', 'chanho', '10', 19, '두절새우(고운색깔과튼실한속살이자랑)', 5000, '	두절새우(고운색깔과튼실한속살이자랑)\n오늘 배송받았는데 많아서\n저렴하게 1팩 팝니다.\n\n교환.반품 안되요:)'),
('chanho@naver.com', 'chanho', '12', 20, 'RG 건담 더블오 퀀터 풀세이버 트랜스암 클리어', 64000, '	1. 미개봉입니다.\n2. 거래방법: 택배거래\nㅇ 택배비 포함\nㅇ 입금확인 익일 오후 발송 (주말일 경우 월요일 발송)\n3. 결제방법: 안전거래 또는 계좌이체\n4. 기타사항: 가격제안 가능합니다.'),
('seri@nate.com', 'seri', '10', 21, '삼성 공기청정기 큐브', 340000,'삼성 공기청정기 큐브\n스티커도아직그대로네요\n기스하나없이\n깨끗합니다\n21년식이고요\n현재도판매중인모델..\n핸드폰으로도\n조작가능\n많이안써서\n그냥사용하셔도되는데\n찝찝하시면\n필터는교체하세요~~\n※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명(ex. 3000시리즈 전동 면도기)”을 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!'),
('seri@nate.com', 'seri', '6', 22, '아이패드 프로11 2세대 셀룰러 + 애플펜슬 2세대 등', 730000,'아이패드 프로11 2세대 128g 셀룰러 + 케이스\n애플펜슬 2세대 + 펜슬커버 및 케이스 +추가펜촉\n로지콤보 일괄 + 산드로 파우치\n\n주로 넷플릭스와 유튜브,\n간혹미팅시 가지고 다녔습니다\n노트북이나 서피스를 이용하다보니\n활용도가 낮아져 판매합니다\n\n128기가에 셀룰러, 바로 액정보호필름 붙여 사용\n박스, 충전기, 전원선 기타 설명서, 스티커 등 구성\n박스와 선은 변색 및 관리소흘로 인한 변색\n최근 배터리 효율은 90이었습니다\n\n펜슬은 커버 사용했으며 최근 새것으로 교체.\n내부상태도 좋으며 인식잘됩니다.\n펜슬커버 및 케이스, 추가펜촉 포함입니다\n\n추가 저렴이 사용감 많은 케이스와\n넣고 다니실수 있는 산드로 파우치까지 드립니다\n\n개별판매 없으며 일괄로만 판매합니다\n\n염창힐스테이트 정문 직거래'),
('seri@nate.com', 'seri', '14', 23, '배민 배달의민족 모바일 상품권 6장', 47000, '	배민 배달의민족 모바일 상품권 6장'),
('seri@nate.com', 'seri', '10', 24, '닛산 막시마 18인치 2354518 휠타이어 팝니다', 800000, '	닛산 맥시마 18인치 휠타이어\n\n휠상태 기스없이 깔끔 하고요\n굴절없이 밸런스 잘나오고요\n\n타이어상태\n235 45 18\n금호타이어 4짝 85% 동일\n\n?위치 : 화성시 팔탄면\n\n대품+현금가 80만원\n대품(장착하고 계신 휠 반납 조건.. 대품 상태 상관없이 받습니다..깡통휠 제외)\n\n0 1 0 - 2 9 7 6 - 4 1 2 2 부재시 문자남겨주세요'),
('seri@nate.com', 'seri', '7', 25, '비누z1 마우스', 40000, '	비누 z1 마우스\n실사용 3시간 미만입니다'),
('seri@nate.com', 'seri', '11', 26, '닌텐도 스위치 게임칩', 30000,'※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명(ex. 동물의 숲2) ”를 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n?? 오늘 작성가능한 게시글 수가 부족하다면, 상단에 ""중고나라 앱 다운받기""를 통해서 앱에서 작성해 주세요!\n\n\n도라에몽 진구의 목장 이야기 - 2.5\n파이어엠블렘 인게이지 - 3.5\n칼리굴라2 - 2\n젤다의 전설 스카이워드 소드 판매완료\n팩맨 월드 리팩 - 2\n포켓몬스터 브릴리언트 다이아몬드 - 3\n\n일괄 12에 드립니다 일괄 우대\n\n반값택배 +2000원\n일반택배 +3500원'),
('seri@nate.com', 'seri', '10', 27, '에어팟 맥스2 AirPod max2 팝니당', 650000, '	에어팟 맥스2 c타입 충전기 한 번도 사용하지 않았고 한번 착용 후 케이스에 씌어 보관했습니다 판매이유는 옷스타일이랑 안어울려서 판매합니다! 공홈에서 샀고 인증 필요하시면 말씀해 주세영\n0105삼29팔9이1'),
('seri@nate.com', 'seri', '12', 28, '실바니안 블라인드백 판매', 6000, '	가격은 사진에 있어용~\n자세한 사진은 채팅 주시면 보내드릴게요!\n\n4개 이상 구매 시 피규어 피우치 하나 드릴게요 :)\n원하시는 색상 말해주세요~\n\n소품 없는 친구들은 원하시는 소품 사진 말해주시면 같이 드릴게요ㅎㅎ\n\n피셔고양이는 볼링핀 소품이에요!! 넣어드릴게요'),
('seri@nate.com', 'seri', '12', 29, '레고 스타워즈 8097', 57000,'※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명”를 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n?? 오늘 작성가능한 게시글 수가 부족하다면, 상단에 ""중고나라 앱 다운받기""를 통해서 앱에서 작성해 주세요!\n\n\n\n●●●■■■●●●■■■\n\n판매글 들어가보시면 레고 스타워즈 피규어, 중고물품, 미개봉 새제품 등 대량 판매하고 있습니다\n\n같이 구매하셔서 택배비 아끼시면 좋습니다 :)\n\n택배비는 반값택배 2000원, 일반택배 4000~6000원 입니다. 피규어와 소형제품은 4000 중형제품 5000원 대형제품 6000 생각하시면 됩니다.\n\n중고제품 특성상 교환 환불 불가능하며 네고문의와 택포문의도 미리 거절하겠습니다.\n\n\n\n설명서 박스 없습니다.\n\n외관상으로는 누락 없으며 가지고 놀던 제품이 아니라 누락이 없을 것 같으나 확인하여 본 것이 아니라 확신은 못드리겠습니다.\n\n구매 원하시면 연락주세요~'),
('seri@nate.com', 'seri', '13', 30, '시원스쿨 패밀리탭(평생소장 삼성패드)+교재', 320000, '	받았던상태그대로전시용?\n새상품입니다.\n영원히 안볼 것 같아 냉정하게 정리합니다.'),
('sunny@daum.net', 'sunny', '10', 31, 'FOCAL DOME SUB 포칼 돔 액티브 서브우퍼 스...', 350000,'※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명(ex. 3000시리즈 전동 면도기)”을 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n?? 오늘 작성가능한 게시글 수가 부족하다면, 상단에 ""중고나라 앱 다운받기""를 통해서 앱에서 작성해 보세요!\n\nFOCAL DOME SUB 포칼 돔 액티브 서브우퍼 스피커\n\n외관 상태는 사진과 동일합니다.\n생활기스 및 상처 등 사용감 있지만 깨끗합니다.\n작동 아주 잘 되고 뿜어주는 저음이 엄청나게 강력합니다.\n구성품은 사진의 서브 우퍼만 드립니다.\n무게가 상당합니다. 스피커는 무거울수록 저음의 퀄리티가 좋은법이죠.\n환불, 교환 불가!! 신중한 구매 부탁드립니다.\n\n\n택배 : 별도\n직거래 지역 : 서울 방배동'),
('sunny@daum.net', 'sunny', '14', 32, '호요랜드 토요일 티켓 양도합니다', 30000,'11/2 토요일 티켓 양도합니다\n만약 아래 것들 대리해주신다고 하시면 10000원만 받고 양도해드립니다.\n\n원신 부스 굿즈들(포카, 색지)\n스타레일 부스 굿즈들(포카 어벤츄린 룰렛)\n굿즈존(스타레일 포카셋, 스타레일 미니 아크릴 종류별 하나씩 총 4개)\n이 중 하나 이상 해주시면 됩니다.\n\n제가 약속된 시간에 취소하고 그때 잡아주시면 됩니다. 잡는데 실패하셔도 책임 못져요ㅠㅠ'),
('sunny@daum.net', 'sunny', '18', 33, '정밀니퍼 (수원)', 1000, '	미사용\n수량구매 가능합니다'),
('sunny@daum.net', 'sunny', '10', 34, '소니 wh-ch720n 단순개봉', 140000, '	어제 배송와서 개봉해서 한 번 써본게 끝입니다. 쿠팡보다 3만원정도 싸게 내놓습니다.'),
('sunny@daum.net', 'sunny', '10', 35, '새상품 브리츠 블루투스 스피커 2개 일괄 판매', 39000,'브리츠 블루투스 스피커 BR-MP2200 2개 일괄 판매 합니다.\n미사용 새상품 입니다.\n색상은 블랙과 화이트 입니다.\n네고문의, 추가사진은 정중히 거절 합니다.\n감사합니다'),
('sunny@daum.net', 'sunny', '7', 36, '오자키 스피커', 14000,'※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명(ex. 맥북 에어 13)”를 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n?? 오늘 작성가능한 게시글 수가 부족하다면, 상단에 ""중고나라 앱 다운받기""를 통해서 앱에서 작성해 보세요!\n\n\n\n오자키 스피커 입니다\n\n\n\n오래되서 사용감은 있지만 소리는 잘 나옵니다\n\n\n\n직거래 택배거래 모두가능하고 직거래는 인천, 서울 근교지역에서 가능합니다.\n\n\n\n문자주세요.'),
('sunny@daum.net', 'sunny', '6', 37, '(유사글주의)신형삼성초고속충전기(새상품,정품)', 14000,'??? 새상품 정품, 개당 가격이고 대량 구매 가능\n합니다\n??? 핸드폰 구성품 하나라 벌크가 아니라 벌크에\n비해 고장이 잘 안납니다\n??? 25W 초고속이고 사진예시처럼 보관상 약간의\n기스는 있습니다 기스 적은 순으로 판매 됩니다\n(기스없는 어댑터 천원 추가)\n??? 어댑터 ,케이블 따로 별도로도 구매 가능합니다\n??? 판매상품에 C타입 이어폰도 판매중입니다\n??? 긴 글 읽어 주셔 감사합니다??\n\n??cu끼리, gs반값1800원\n일반 제주 제외 3000원\n모든 택배는 편의점 통해 접수 하고 있습니다\n무게 때문에 추가금 나올시 판매자가 부담하고\n할인쿠폰이 생겨 배송비를 할인 받지 않은 한\n택비로 취하는 이득은 없습니다'),
('sunny@daum.net', 'sunny', '12', 38, '[미사용/택포]알파 뉴채향 한국화 채색 24+2T B세...', 43000,'알파 뉴채향 한국화 채색 24+2T B세트 1개 판매합니다.\n\n이번에 새로 나온 알파 한국화 물감입니다.\n*미사용 새상품입니다.\n(중고나라 판매 제품 사진찍기 위해, 처음 열어봤습니다.)\n*용량 및 구성 : 20ml x 26색\n\n#가격 : 43,000원 (배송비포함/CJ대한통운)\n*네고(에누리) 사양합니다.*'),
('sunny@daum.net', 'sunny', '3', 39, '로맨틱무브 덕 더비 브라운 260', 85000, '	로맨틱무브 덕 더비 브라운 260 판매합니다.\n큰 하자가 없으며 실착도 5회 미만 제품입니다.\n가죽 상태 보시면 상태가 좋다는 걸 알 수 있습니다.\n\n다만 보관할 때에 신발끼리 부딪혔는지 왼쪽 신발을 보시면 살짝 흠집이 있습니다. 크게 신경쓰이는 정도는 아닐것 같습니다.'),
('sunny@daum.net', 'sunny', '14', 40, '신세계 상품권 3만원 판매합니다', 25000, '	신세계 상품권 3만원 판매합니다\n오늘 받았는데요 저는 쓸일없어 양도해요\n당일배송가능합니다\n뒷번호 원할시 사진찍어 보내드립니다\n\n반택2000\n편택3000'),
('yuri@gmail.com', 'yuri', '10', 41, '[맛저트] 커피금빵(200g)', 3000, '	[맛저트] 커피금빵 (200g)\n오늘구입\n사진참조\n\nhttps://m-emart.ssg.com/item/itemView.ssg?itemId=1000624610706&siteNo=6001&salestrNo=6005'),
('yuri@gmail.com', 'yuri', '9', 42, '몬스테라 알보 보르 50', 20000,'※ 택배시(우체국) + 5000원-파손면책 동의시 발송가능\n\n직거래-의정부\n\n식물특성상 교환,환불 불가\n\n\n\n겨울 택배 배송은 못 할것 같아서\n더 추워지기 전에\n저렴히 올려요.\n\n\n\n\n합배송 가능하니 다른 상품도 둘러봐 주세요^^'),
('yuri@gmail.com', 'yuri', '7', 43, 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 465000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.'),
('yuri@gmail.com', 'yuri', '4', 44, '록시땅 미니 핸드크림 6종 키트 팔아요', 28000, '	금일 카카오 선물 받은 록시땅 핸드크림 6종 키트 입니다 :)\n\n구매하실 때 저한테 배송지 전달해주시면 카카오에서 바로 배송 됩니다!\n\n정가: 3만원'),
('yuri@gmail.com', 'yuri', '6', 45, '레노버 Y700 1세대 8/128', 165000, '	(택거래 절대 안합니다. 문의x)\n\n스팀링크 플레이 위주로 사용했고\n기존 태블릿이 두 대라 판매합니다.\n\n반글화 완료 (설정 영문 상태)\n\n외관 상태는 양호한 편\n\n젤리케이스 장착돼있습니다.\n(TPU 시간이 지나 누리끼리함)\n\n구매시\n레노버 무선 이어폰 따로 드립니다.\n(거의 사용하지 않음)\n\n\n기타 구성:\nLG충전기 + 케이블 + 케이스\n(기존 충전기 잃어버림)\n\n\n\n제품 박스는 없습니다.\n사진상 게임패드는 제가 사용중이고\n예시이니 따로 구매하셔야 할 겁니다.\n\n\n용인 처인구 유방동에서 거래합니다.\n택거래는 안합니다.\n택거래 문의X'),
('yuri@gmail.com', 'yuri', '10', 46, 'LG TV 벽걸이 지지대', 10000,'※ 카페 상품 게시글은 자동으로 중고나라 앱/사이트에 노출합니다. 노출을 원하지 않으실 경우 고객센터로 문의 바랍니다.\n※ 등록한 게시글이 회원의 신고를 받거나 이상거래로 모니터링 될 경우 중고나라 사기통합조회 DB로 수집/활용될 수 있습니다.\n───────────────────\n?? 제목에 ""제조사/ 브랜드 명""과 ""상품명(ex. BESPOKE 4도어) ”를 넣어 작성하면, 보다 빠른 판매가 가능합니다!\n?? 게시글 작성 시 배송 방법에 “직거래”와 “내 위치” 설정할 경우, 보다 빠른 판매가 가능합니다!\n\n\nLG TV 벽걸이 지지대\n\n개봉 보관 미사용이고 구성품 전부 그대로 있습니다\n눈에 띄는 하자는 딱히 없고 상태 괜찮아요\n\n자세한 사항은 모델명 LSW430AX\n혹은 MEC62385114\n검색 후 lg 전자에 문의해보세요\n\n직거래 산곡역\n택배?? 거래 시 배송비 착불입니다\n\n거래 후 환불x'),
('yuri@gmail.com', 'yuri', '6', 47, 'LG X4(2019) 32GB 그레이+X4 16GB블랙', 80000, '모델명 : X420+410\n색상 : 그레이+블랙\n기가수 : 32/16GB\n(SK , KT , LG , 알뜰폰 사용가능)\n\n본 사진은 작성일 기준 실물 사진입니다.\n\n?12가지 기본 성능테스트 : 이상없음\n?외관 상태 : 생활기스 (사진참고)\n?잔상 유무 : 무\n?최초 통신사 : SKT\n?최초 개통일 : 만료\n\n정상해지 단말기로 25% 선택약정 가능해요 ???\n터치,지문 등 기능 전혀 이상 없어요 ????\nX420 : 뒤판 얼룩/하단 찍힘\nX410 : 생활기스 및 액정 상단 들림\n둘 다 잔상은 없어요!!\n\n◈직.거래: 김해 전지역 가능합니다!\n◈택배거래 : 15:00분 이전 입금 시 당일 발송/ 로젠택배는 하루 소요됩니다.\n(일요일 택배업무X/월요일은 택배사에서 일찍 마감하여 1시 전 입금 시 당일 발송 가능)\n\n소중한 기기인만큼 에어캡에 꼼꼼하게 싸서 보내 드릴게요(?? ˘ ³˘)\n\n★분실/도난 단말기는 취급하지 않습니다.\n★기재되지 않은 기기 성능이나 기능에는 전혀 문제 없습니다.\n★구매 후 기계에 문제가 있을시엔 언제든지 24시간 문의가능 합니다.\n(기능에 기재되지 않은 문제가 있을시 환불처리 해드립니다.)\n\n\n원하시는 기종 문의주시면 최저가로 맞춰 드리겠습니다.\n김해시 어방동 플렉스샵 :)\n\n고객님의 단순 변심으로 반품&환불은 불가하므로 꼭 유의해주세요!!!!\nH230'),
('yuri@gmail.com', 'yuri', '1', 48, '롤렉스 컴퓨터판 16233 18k', 7700000,'로렉스 컴퓨터판 콤비입니다\n36mm\n96년식이나 구형처럼 보이지 않고 굉장히 세련됐습니다\n\n세계명품시계 감정원에서 받은 감정서 있습니다.\n\n오보홀, 폴리싱도 다 했어요.\n상태, 무브먼트도 최상입니다 s급\n로렉스 시계는 지금이 제일 저렴하거 아시죠\n계속올라갑니다\n특히 이 롤렉스는 18k라서 더더 오릅니다\n요즘 금값이 엄청 오르는데 전문가들은 더 오를거라고 합니다.\n\n케이스 드리긴 하는데 케이스는 까짐 있고 상태 별로입니다 참고해주세요\n\n직거래 선호합니다\n인천 연수/ 종로도 가능'),
('yuri@gmail.com', 'yuri', '8', 49, '소니 크롭 미러리스 a6000', 380000,'24년 1월에 중고로 구매해서 사용하다가 기기변경으로 판매합니다.\n컷수는 12000대입니다\n\n구성품 : 박스, 카메라 바디, 배터리1개, 충전 케이블, 32G 메모리카드\n\n이전 사용자분께서 삼각대 사용을 많이하셔서 결합 부분에 기스가 좀 있는데, 사용하는데 아무런 문제 없습니다.\n\n직거래는 서울시 중랑구 동대문구 선호합니다.\n그외 지역도 안하는 건 아니니 문의주세요\n\n택배비 무료입니다'),
('yuri@gmail.com', 'yuri', '14', 50, '투썸플레이스 5만원권', 45000, '	2장 판매합니다.\n25년 10월 18일까지 사용 가능합니다');

SELECT * FROM TBL_PRODUCT;
INSERT INTO TBL_PRODUCT (P_OWNER_ID, P_OWNER_NICK, P_CATEGORY, P_NAME, P_PRICE, P_DESC, P_REG_DATE, P_MOD_DATE, P_IMAGE_NO)
VALUES
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 465000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-05T16:08','2024-10-05T16:08',51),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 365000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-07T16:08','2024-10-07T16:08',52),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 265000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-09T16:08','2024-10-09T16:08',53),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 435000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-12T16:08','2024-10-12T16:08',54),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 425000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-15T16:08','2024-10-15T16:08',55),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 405000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-18T16:08','2024-10-18T16:08',56),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 329000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-21T16:08','2024-10-21T16:08',57),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 249000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-23T16:08','2024-10-23T16:08',58),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 559000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-25T16:08','2024-10-25T16:08',59),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 379000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-28T16:08','2024-10-28T16:08',60),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 299000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-30T16:08','2024-10-30T16:08',61),
('gildong@gmail.com', 'gildong', '7','15.6인치 3D/게이밍 노트북/8GB', 400000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-11-01T16:08','2024-11-01T16:08',62);


insert into tbl_product_image (pi_p_no, pi_file)
values 
(51, '17303834774557ha_Qtn0H.jpg'),
(52, '17303834774557ha_Qtn0H.jpg'),
(53, '17303834774557ha_Qtn0H.jpg'),
(54, '17303834774557ha_Qtn0H.jpg'),
(55, '17303834774557ha_Qtn0H.jpg'),
(56, '17303834774557ha_Qtn0H.jpg'),
(57, '1729132713539l8s_E5rCJ.jpg'),
(58, '1729132713539l8s_E5rCJ.jpg'),
(59, '1729132713539l8s_E5rCJ.jpg'),
(60, '1729132713539l8s_E5rCJ.jpg'),
(61, '1729132713539l8s_E5rCJ.jpg'),
(62, '1729132713539l8s_E5rCJ.jpg');

SELECT * FROM TBL_PRODUCT;
INSERT INTO TBL_PRODUCT (P_OWNER_ID, P_OWNER_NICK, P_CATEGORY, P_NAME, P_PRICE, P_DESC, P_REG_DATE, P_MOD_DATE, P_IMAGE_NO, P_STATE)
VALUES
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 415000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-05T16:08','2024-10-05T16:08',63,2),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 300000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-07T16:08','2024-10-07T16:08',64,2),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 235000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-09T16:08','2024-10-09T16:08',65,2),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 400000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-12T16:08','2024-10-12T16:08',66,2),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 385000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-15T16:08','2024-10-15T16:08',67,2),
('yuri@gmail.com', 'yuri', '7', 'HP 빅터스 16 3050ti 게이밍노트북 판매합니다.', 355000,'HP 빅터스 16-e0142AX 판매합니다. 동생이 사용하던 노트북인데 이제 사용하지 않아 판매하게되었습니다.\n\nCPU:라이젠 5 5600H(6코어 12쓰레드)\nRAM:DDR4 24GB(8+16GB)\nSSD:256GB+512GB\nGPU:RTX3050TI 4GB(데탑 3050과 동급)\n\n대략적인 사양은 이렇고 배터리 효율은 100%라 사실상 새 상품과 동일한 배터리 성능을 보여줍니다. 사진에서 보다시피 SD카드 슬롯 부분 플라스틱이 약간 파손되어 있지만 인식이나 사용에는 문제 없어서 이 부분에 민감하지 않으시면 그냥 사용하셔도 무방합니다. 포맷후 기본적인 프로그램 깔아서 드리며 구성품은 노트북, 쿨링패드, 마우스패드, 저소음 무선 마우스입니다. 풀박스라 박스도 가지고 있어서 박스에 넣어서 드립니다. 직거래는 포항이며 직거래시 46만원 그 이외는 택비포함 46만 5천원입니다. 안전거래 가능하나 선입금을 우선시 합니다. 자세한 사양은 사진을 참고하시고 구매의사 있으시면 연락부탁드립니다.','2024-10-18T16:08','2024-10-18T16:08',68,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 300000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-21T16:08','2024-10-21T16:08',69,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 200000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-23T16:08','2024-10-23T16:08',70,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 539000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-25T16:08','2024-10-25T16:08',71,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 350000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-28T16:08','2024-10-28T16:08',72,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 239000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-10-30T16:08','2024-10-30T16:08',73,2),
('gildong@gmail.com', 'gildong', '7', '15.6인치 3D/게이밍 노트북/8GB', 350000,'15.6인치 UHD 화면으로 화질이 밝고\n\n선명합니다\n\n고화질 3D영상, 3D게임 가능합니다\n\n견고하게 만들어지고 내구성 좋은 제품입니다\n\n얇고 가벼워 이동하기 좋고 휴대하기\n\n편리합니다\n\n키보드 감이 부드럽고 불편하지 않습니다\n\nCPU는 I3 32나노 공정으로\n\n엄청난 빠른 속도를 자랑합니다\n\n롤, 서든등 잘됩니다','2024-11-01T16:08','2024-11-01T16:08',74,2);

insert into tbl_product_image (pi_p_no, pi_file)
values 
(63, '17303834774557ha_Qtn0H.jpg'),
(64, '17303834774557ha_Qtn0H.jpg'),
(65, '17303834774557ha_Qtn0H.jpg'),
(66, '17303834774557ha_Qtn0H.jpg'),
(67, '17303834774557ha_Qtn0H.jpg'),
(68, '17303834774557ha_Qtn0H.jpg'),
(69, '1729132713539l8s_E5rCJ.jpg'),
(70, '1729132713539l8s_E5rCJ.jpg'),
(71, '1729132713539l8s_E5rCJ.jpg'),
(72, '1729132713539l8s_E5rCJ.jpg'),
(73, '1729132713539l8s_E5rCJ.jpg'),
(74, '1729132713539l8s_E5rCJ.jpg');
