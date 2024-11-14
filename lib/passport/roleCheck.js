function roleCheck(requiredRole) {
    return function(req, res, next) {
        if (!req.isAuthenticated()) {
            // 로그인되지 않은 경우
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                // JSON 요청 시 401 에러 반환
                return res.status(401).json({ message: '로그인이 필요합니다.' });
            } else {
                // HTML 요청 시 로그인 페이지로 리디렉션
                return res.redirect('/user/sign_in_form');
            }
        }

        if (req.user && req.user.U_ACTIVE === requiredRole) {
            return next();  // 정상적인 요청은 계속 진행
        } else {
            // 권한 오류 처리
            if (req.headers.accept && req.headers.accept.includes('application/json')) {
                // JSON 요청 시 403 에러 반환
                return res.status(403).json({ message: '정지된 계정은 이 작업을 진행할 수 없습니다. 관리자에게 문의하세요.' });
            } else {
                // HTML 요청 시 403 페이지 렌더링
                return res.render('error/403', { message: '정지된 계정은 이 작업을 진행할 수 없습니다. 관리자에게 문의하세요.' });
            }
        }
    };
}

module.exports = roleCheck;
