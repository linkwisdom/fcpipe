
(function() {
    var url = location.url;
    if (url.indexOf('castk=')) {
        location.url = url.replace('castk', '_token');
    }
})