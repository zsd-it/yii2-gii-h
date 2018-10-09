$(document).ready(function () {
    $('.clickBtn').bind('click', function () {
        fullScreen();
    });

    function fullScreen() {
        $('#content-main').css({'width': '100%', 'height': '100%'});
        var docElm = document.getElementById('content-main');//要被全屏的元素
        //W3C
        if (docElm.requestFullscreen) {
            docElm.requestFullscreen();
        }
        //FireFox
        else if (docElm.mozRequestFullScreen) {
            docElm.mozRequestFullScreen();
        }
        //Chrome等
        else if (docElm.webkitRequestFullScreen) {
            docElm.webkitRequestFullScreen();
        }
        //IE11
        else if (docElm.msRequestFullscreen) {
            docElm.msRequestFullscreen();
        }
    }
})