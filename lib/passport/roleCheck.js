function roleCheck(requiredRole) {
    return function(req, res, next) {
        if (!req.isAuthenticated()) {
            return res.redirect('/user/sign_in_form'); 
        }

        if (req.user && req.user.U_ACTIVE === requiredRole) {
            return next(); 
        } else {
            return res.render('error/403', { message: '정지된 계정은 이 작업을 진행할 수 없습니다. 관리자에게 문의하세요.' });
        }
    };
}

module.exports = roleCheck;
