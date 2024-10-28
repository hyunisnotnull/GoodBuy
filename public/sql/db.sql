-- DB_GOODBUY

CREATE DATABASE DB_GOODBUY;
USE DB_GOODBUY;

DROP TABLE TBL_USER;
CREATE TABLE TBL_USER(
<<<<<<< HEAD
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
   U_ACTIVE               TINYINT DEFAULT 2,                  -- 0(삭제된 계정), 1(활동중인 계정), 2(정지된 계정)
   U_CLASS                 TINYINT DEFAULT 2,                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
   U_POINT                 SMALLINT DEFAULT 100,               -- 100점 획득시 등급 상승
   U_PENALTY               TINYINT DEFAULT 0,                  -- 잔여 페널티(3패널티에 1일 정지)
   U_BAN_START_DATE       DATETIME,                            -- 정지 시작 날짜
    U_BAN_END_DATE          DATETIME,                           -- 정지 종료 날짜
   U_REG_DATE               DATETIME DEFAULT NOW(),
   U_MOD_DATE               DATETIME DEFAULT NOW(),
   PRIMARY KEY(U_NO)
=======
	U_NO               		INT AUTO_INCREMENT,
	U_ID               		VARCHAR(20) UNIQUE,
	U_PW               		VARCHAR(100) NOT NULL,
	U_PROFILE_THUM       	VARCHAR(50),
	U_NICK               	VARCHAR(20) UNIQUE,
	U_PHONE              	VARCHAR(20) NOT NULL,
	U_SEX               	VARCHAR(2) NOT NULL,            	-- M(남) W(여)
	U_AGE               	VARCHAR(10) NOT NULL,            	-- 연령대
	U_POST_ADDRESS       	VARCHAR(100) NOT NULL,            	-- 우편번호 주소
	U_DETAIL_ADDRESS    	VARCHAR(50),                  		-- 상세 주소
	U_SNS_ID            	VARCHAR(30),                  		-- 구글, 네이버 ID
	U_ACTIVE            	TINYINT DEFAULT 2,               	-- 0(삭제된 계정), 1(활동중인 계정), 2(정지된 계정)
	U_CLASS              	TINYINT DEFAULT 2,               	-- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
	U_POINT              	SMALLINT DEFAULT 100,            	-- 100점 획득시 등급 상승
	U_PENALTY            	TINYINT DEFAULT 0,               	-- 잔여 페널티(3패널티에 1일 정지)
	U_BAN_START_DATE    	DATETIME,                      		-- 정지 시작 날짜
    U_BAN_END_DATE          DATETIME,                     		-- 정지 종료 날짜
	U_REG_DATE            	DATETIME DEFAULT NOW(),
	U_MOD_DATE            	DATETIME DEFAULT NOW(),
	PRIMARY KEY(U_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_USER;

DROP TABLE TBL_ADMIN;
CREATE TABLE TBL_ADMIN(
<<<<<<< HEAD
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
=======
	A_NO               		INT AUTO_INCREMENT,
	A_ID               		VARCHAR(20) UNIQUE,
	A_PW               		VARCHAR(100) NOT NULL,
	A_MAIL               	VARCHAR(20) NOT NULL,
	A_PHONE              	VARCHAR(20) NOT NULL,
	A_PROFILE_THUM         	VARCHAR(50),
	A_ROLE               	VARCHAR(20) DEFAULT 'PRE_ADMIN',      -- 1(PRE_ADMIN), 2(ADMIN), 3(SUPER_ADMIN)
	A_REG_DATE             	DATETIME DEFAULT NOW(),
	A_MOD_DATE             	DATETIME DEFAULT NOW(),
	PRIMARY KEY(A_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_ADMIN;

DROP TABLE TBL_PRODUCT;
CREATE TABLE TBL_PRODUCT(
<<<<<<< HEAD
   P_NO                     INT AUTO_INCREMENT,
   P_OWNER_ID               VARCHAR(20) NOT NULL,
   P_OWNER_NICK            VARCHAR(20) NOT NULL,
    P_CATEGORY               VARCHAR(20) NOT NULL,
    P_IMAGE                  VARCHAR(50) NOT NULL,
   P_NAME                  VARCHAR(100) NOT NULL,
   P_DESC                  TEXT NOT NULL,
   P_PRICE                  INT NOT NULL,
   P_STATE                  TINYINT DEFAULT 3,                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
   P_REG_DATE              DATETIME DEFAULT NOW(),
   P_MOD_DATE               DATETIME DEFAULT NOW(),
   PRIMARY KEY(P_NO)
=======
	P_NO               		INT AUTO_INCREMENT,
	P_OWNER_ID            	VARCHAR(20) NOT NULL,
	P_OWNER_NICK         	VARCHAR(20) NOT NULL,
    P_CATEGORY            	VARCHAR(20) NOT NULL,
    P_IMAGE               	VARCHAR(50) NOT NULL,
	P_NAME               	VARCHAR(100) NOT NULL,
	P_DESC               	TEXT NOT NULL,
	P_PRICE               	INT NOT NULL,
	P_STATE               	TINYINT DEFAULT 3,                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
	P_REG_DATE           	DATETIME DEFAULT NOW(),
	P_MOD_DATE            	DATETIME DEFAULT NOW(),
	PRIMARY KEY(P_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_PRODUCT;

DROP TABLE TBL_SALE;
CREATE TABLE TBL_SALE(
<<<<<<< HEAD
   S_NO                     INT AUTO_INCREMENT,
   S_PRODUCT_NO            INT NOT NULL,
   S_SELLER_ID               VARCHAR(20) NOT NULL,
   S_SELLER_NICK            VARCHAR(20) NOT NULL,
   S_BUYER_ID               VARCHAR(20) NOT NULL,
   S_BUYER_NICK            VARCHAR(20) NOT NULL,
   S_TRADE_DATE            DATETIME,
   S_STATE                  TINYINT,                           -- 0(삭제), 1(취소), 2(완료), 3(판매 중)
   S_REG_DATE               DATETIME DEFAULT NOW(),
   S_MOD_DATE               DATETIME DEFAULT NOW(),
   PRIMARY KEY(S_NO)
=======
	S_NO               		INT AUTO_INCREMENT,
	S_PRODUCT_NO         	INT NOT NULL,
	S_SELLER_ID            	VARCHAR(20) NOT NULL,
	S_SELLER_NICK         	VARCHAR(20) NOT NULL,
	S_BUYER_ID            	VARCHAR(20) NOT NULL,
	S_BUYER_NICK         	VARCHAR(20) NOT NULL,
	S_TRADE_DATE         	DATETIME,
	S_STATE               	TINYINT,                     		-- 0(삭제), 1(취소), 2(완료), 3(판매 중)
	S_REG_DATE            	DATETIME DEFAULT NOW(),
	S_MOD_DATE            	DATETIME DEFAULT NOW(),
	PRIMARY KEY(S_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_SALE;

DROP TABLE TBL_AUCTION;
CREATE TABLE TBL_AUCTION(
<<<<<<< HEAD
   AU_NO                  INT AUTO_INCREMENT,
   AU_PRODUCT_NO            INT NOT NULL,
   AU_SELLER_ID            VARCHAR(20) NOT NULL,
   AU_SELLER_NICK            VARCHAR(20) NOT NULL,
   AU_BUYER_ID               VARCHAR(20) NOT NULL,
   AU_BUYER_NICK            VARCHAR(20),
   AU_PRICE               INT,
   AU_TRADE_DATE            DATETIME,
   AU_STATE               TINYINT,                           -- 0(삭제), 1(취소), 2(완료), 4(경매중)
   AU_REG_DATE               DATETIME DEFAULT NOW(),
   AU_MOD_DATE               DATETIME DEFAULT NOW(),
   PRIMARY KEY(AU_NO)
=======
	AU_NO               	INT AUTO_INCREMENT,
	AU_PRODUCT_NO         	INT NOT NULL,
	AU_SELLER_ID         	VARCHAR(20) NOT NULL,
	AU_SELLER_NICK         	VARCHAR(20) NOT NULL,
	AU_BUYER_ID            	VARCHAR(20) NOT NULL,
	AU_BUYER_NICK         	VARCHAR(20),
	AU_PRICE            	INT,
	AU_TRADE_DATE         	DATETIME,
	AU_STATE            	TINYINT,                     		-- 0(삭제), 1(취소), 2(완료), 4(경매중)
	AU_REG_DATE            	DATETIME DEFAULT NOW(),
	AU_MOD_DATE            	DATETIME DEFAULT NOW(),
	PRIMARY KEY(AU_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_AUCTION;

DROP TABLE TBL_CHAT;
CREATE TABLE TBL_CHAT(
<<<<<<< HEAD
<<<<<<< HEAD
   CH_NO                  INT AUTO_INCREMENT,
   CH_OWNER_ID               VARCHAR(20) NOT NULL,
   CH_OWNER_NICK            VARCHAR(20) NOT NULL,
   CH_OTHER_ID               VARCHAR(20) NOT NULL,
   CH_OTHER_NICK            VARCHAR(20) NOT NULL,
    CH_TITLE               VARCHAR(20) NOT NULL,
   CH_BODY                  TEXT,
   CH_ACTIVE               TINYINT   DEFAULT 1,                  -- 0(DELETE), 1(ACTIVE)
   CH_REG_DATE             DATETIME DEFAULT NOW(),
   CH_MOD_DATE            DATETIME DEFAULT NOW(),
   PRIMARY KEY(CH_NO)
=======
	CH_NO					INT AUTO_INCREMENT,
	CH_OWNER_ID				VARCHAR(20) NOT NULL,
	CH_OWNER_NICK			VARCHAR(20) NOT NULL,
	CH_OTHER_ID				VARCHAR(20) NOT NULL,
	CH_OTHER_NICK			VARCHAR(20) NOT NULL,
    CH_TITLE				VARCHAR(20) NOT NULL,
	CH_BODY					TEXT,
	CH_ACTIVE				TINYINT	DEFAULT 2,					-- 0(DELETE), 2(ACTIVE)
	CH_REG_DATE 			DATETIME DEFAULT NOW(),
	CH_MOD_DATE 			DATETIME DEFAULT NOW(),
=======
	CH_NO               	INT AUTO_INCREMENT,
	CH_OWNER_ID            	VARCHAR(20) NOT NULL,
	CH_OWNER_NICK         	VARCHAR(20) NOT NULL,
	CH_OTHER_ID            	VARCHAR(20) NOT NULL,
	CH_OTHER_NICK         	VARCHAR(20) NOT NULL,
    CH_TITLE            	VARCHAR(20) NOT NULL,
	CH_BODY               	TEXT,
	CH_ACTIVE            	TINYINT   DEFAULT 1,               	-- 0(DELETE), 1(ACTIVE)
	CH_REG_DATE          	DATETIME DEFAULT NOW(),
	CH_MOD_DATE         	DATETIME DEFAULT NOW(),
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
	PRIMARY KEY(CH_NO)
>>>>>>> 4208d8eab80283934cda354f546dd84e03b4d326
);
SELECT * FROM TBL_CHAT;

DROP TABLE TBL_CHAT_IMAGE;
CREATE TABLE TBL_CHAT_IMAGE(
<<<<<<< HEAD
   CI_NO                  INT AUTO_INCREMENT,
   CI_CH_NO               INT   NOT NULL,
   CI_FILE                  VARCHAR(100) NOT NULL,
   PRIMARY KEY(CI_NO)
=======
	CI_NO               	INT AUTO_INCREMENT,
	CI_CH_NO            	INT   NOT NULL,
	CI_FILE               	VARCHAR(100) NOT NULL,
	PRIMARY KEY(CI_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_CHAT_IMAGE;

DROP TABLE TBL_PRODUCT_IMAGE;
CREATE TABLE TBL_PRODUCT_IMAGE(
<<<<<<< HEAD
   PI_NO                  INT AUTO_INCREMENT,
   PI_CH_NO               INT   NOT NULL,
   PI_FILE                  VARCHAR(100) NOT NULL,
   PRIMARY KEY(PI_NO)
=======
	PI_NO               	INT AUTO_INCREMENT,
	PI_CH_NO            	INT   NOT NULL,
	PI_FILE               	VARCHAR(100) NOT NULL,
	PRIMARY KEY(PI_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_PRODUCT_IMAGE;

DROP TABLE TBL_CATEGORY;
CREATE TABLE TBL_CATEGORY(
<<<<<<< HEAD
   C_NO                     INT AUTO_INCREMENT,
   C_NAME                  VARCHAR(20),
   PRIMARY KEY(C_NO)
=======
	C_NO               		INT AUTO_INCREMENT,
	C_NAME               	VARCHAR(20),
	PRIMARY KEY(C_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_CATEGORY;

DROP TABLE TBL_ACTIVE;
CREATE TABLE TBL_ACTIVE(
<<<<<<< HEAD
   AC_NO                  INT AUTO_INCREMENT,
   AC_NAME                  VARCHAR(20),                  -- 0(삭제) 1(정지), 2(활동)
   PRIMARY KEY(AC_NO)
=======
	AC_NO               	INT AUTO_INCREMENT,
	AC_NAME               	VARCHAR(20),                  -- 0(삭제) 1(정지), 2(활동)
	PRIMARY KEY(AC_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_ACTIVE;

DROP TABLE TBL_CLASS;
CREATE TABLE TBL_CLASS(
<<<<<<< HEAD
   CL_NO                  INT AUTO_INCREMENT,
   CL_NAME                  VARCHAR(20),                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
   PRIMARY KEY(CL_NO)
=======
	CL_NO               	INT AUTO_INCREMENT,
	CL_NAME               	VARCHAR(20),                  -- 0(UNRANK), 1(IRON), 2(BRONZE), 3(SILVER), 4(GOLD), 5(PLATINUM), 6(DIAMOND)
	PRIMARY KEY(CL_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_CLASS;

DROP TABLE TBL_STATE;
CREATE TABLE TBL_STATE(
<<<<<<< HEAD
   ST_NO                  INT AUTO_INCREMENT,
   ST_NAME                  VARCHAR(20),                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
   PRIMARY KEY(ST_NO)
=======
	ST_NO               	INT AUTO_INCREMENT,
	ST_NAME               	VARCHAR(20),                  -- 0(삭제) 1(취소) 2(판매완료), 3(판매중), 4(경매중)
	PRIMARY KEY(ST_NO)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
);
SELECT * FROM TBL_STATE;

DROP TABLE TBL_WISHLIST;
CREATE TABLE TBL_WISHLIST(
<<<<<<< HEAD
   W_NO INT AUTO_INCREMENT,
    W_USER_NO INT NOT NULL,                                -- 사용자 ID (TBL_USER의 U_NO와 연관)
    W_PRODUCT_NO INT NOT NULL,                             -- 상품 ID (TBL_PRODUCT의 P_NO와 연관)
=======
	W_NO INT AUTO_INCREMENT,
    W_USER_NO INT NOT NULL,                             	-- 사용자 ID (TBL_USER의 U_NO와 연관)
    W_PRODUCT_NO INT NOT NULL,                          	-- 상품 ID (TBL_PRODUCT의 P_NO와 연관)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
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
<<<<<<< HEAD
    E_URL VARCHAR(255),                                    -- 이벤트 URL
    E_DESC TEXT,                                            -- 이벤트 설명 (선택적)
    E_ACTIVE TINYINT DEFAULT 1,                              -- 0(DELETE), 1(ACTIVE), 2(STOP)
=======
    E_URL VARCHAR(255),                                 	-- 이벤트 URL
    E_DESC TEXT,                                            -- 이벤트 설명 (선택적)
    E_ACTIVE TINYINT DEFAULT 1,                           	-- 0(DELETE), 1(ACTIVE), 2(STOP)
>>>>>>> ef59ea5c882a7e583814824ec82b3631768e4448
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
