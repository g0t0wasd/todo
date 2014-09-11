(function() {

    window.App = {
        Models: {},
        Collections: {},
        Views: {},
        Routs : {}
    };

// template rendering function
    window.template = function(id) {
        return _.template( $('#' + id).html() );
    };

// Task Model
    App.Models.Task = Backbone.Model.extend({
        defaults: {
            name : "My task",
            descr : "Code moar!"
        }
    });
// The View for a single task
    App.Views.TaskView = Backbone.View.extend({
        tagName: 'li class="list-group-item"',

        template: template('taskTemplate'),

        initialize: function(){
            this.model.on('change', this.render, this);
            this.model.on('destroy', this.remove, this);
        },

        events: {
            "click .edit" : "taskDone",
            'click .delete' : 'deleteTask',
            'click .single-task-wrapper':"showSingle"

        },
        taskDone : function(){
            $(this.el).children("div").addClass("done");
            $(this.el).children(".edit").children().css("visibility", "visible");
        },

        deleteTask: function(){
            this.model.destroy();
        },

        showSingle : function(){
            my_router.navigate('check/'+_.indexOf(myTaskList.models, this.model),true);
        },

        remove: function(){
            this.$el.remove();
        },

        render: function() {
            this.$el.html( this.template(this.model.toJSON()) );
            return this;
        }
    });
// ToDos Collection
    App.Collections.ToDoList = Backbone.Collection.extend({
        model: App.Models.Task
    });
// ToDos view
    App.Views.ToDoListView = Backbone.View.extend({
        tagName: 'ul class="group-list"',
        initialize: function() {
            this.collection.on('add', this.addOne, this);
        },

        render: function() {
            this.collection.each(this.addOne, this);
            return this;
        },

        addOne: function(task) {
            var taskView = new App.Views.TaskView({ model: task });
            this.$el.append(taskView.render().el);
        }
    });
// View for adding new Task
    App.Views.AddTask = Backbone.View.extend({
        el: "#addTaskView",
        events : {
            "click #addNewTask":"submit"
        },
        template : template("addTask"),
        initialize : function(){
            this.render();
        },
        render : function(){
            this.$el.html(this.template());
        },
        submit : function(){
            var name = this.$el.find("input[type=text]").val();
            if (name == ""){
                name = "New task name";
            }
            var descr = this.$el.find("textarea").val();
            myTaskList.add({name:name,descr:descr});
            $("p").html("Added: "+name+" task");
            this.$el.find("input[type=text]").val("");
            this.$el.find("textarea").val("");
        }
    });
// Full task view
    App.Views.FullView = Backbone.View.extend({
        my_template : template("singleTask"),
        render : function(){
            var current = _.indexOf(myTaskList.models, this.model);
            var prev = current === 0 ? myTaskList.length -1 : current - 1;
            var next = current === myTaskList.length -1 ? 0 : current + 1;
            this.model.set({prev:prev, next:next});
            this.$el.html(this.my_template(this.model.toJSON()));
            return this;
        }
    });
    App.Router = Backbone.Router.extend({
       routes : {
           "":"index",
           "add":"add",
           "check/:id":"check"
       },
       index : function(){
           place.hide();
           list.show();
           full.hide();
       },
       add : function(){
          list.hide();
          place.show();
          full.hide();
          $("#status").html("");
       },
       check : function(id){
           place.hide();
           list.hide();
           full.show();
           var task = myTaskList.models[id];
           var fullView = new App.Views.FullView({model: task});
           full.html(fullView.render().el);
       }
    });

    // demo data
    var myTaskList = new App.Collections.ToDoList([
     {
         name:"Составить список дел",
         descr : "Описание первого задания"
     },
     {
         name:"Выполнить первое задание",
         descr : "Описание второго задания"
     },
     {
         name:"Зачеркнуть певое дело",
         descr : "Описание третьего задания"
     },
    {
        name:"Отдыхать",
        descr : "Описание четвертого задания "
    },
        {
            name : "Купить молока",
            descr: "Пойти в продуктовый магазин, который находится на улице Пушкина. Зайти в него, выбрать 2 пакета молока по полтора литра, жирностью два с половиной процента. Заплатить за молоко и принести его домой"
        }
     ]);

    var list = $(".theList");
    var place = $("#addTaskView");
    var full = $(".full");
    var addTaskView = new App.Views.AddTask({ collection: myTaskList });
    var myTaskListView = new App.Views.ToDoListView({ collection: myTaskList });
    list.append(myTaskListView.render().el);
    var my_router = new App.Router;
    Backbone.history.start();
})();

var wrapper = $("#wrapper");
if (innerWidth > 1500){
    wrapper.css("width", 900);
}else if (innerWidth < 900) {
    wrapper.css("width", innerWidth);
    wrapper.css("margin", 0);
}
