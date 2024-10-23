const homeService = {

    home: (req, res) => {
        res.render('home/home', {loginedUser: req.user});

    },
    
}

module.exports = homeService;