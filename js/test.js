(function(){

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Router: {}
    };
    App.Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            "show/:id":"show"
        },

        index: function(){
            $(document.body).append("<ul><li>Go get dota</li></ul>");
        },

        show: function(id){
            $(document.body).append("Show route has been called with id "+id);
        }

    });

    new App.Router;
    Backbone.history.start();
})();