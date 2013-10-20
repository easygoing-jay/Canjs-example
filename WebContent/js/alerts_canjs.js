(function(){
var Alert = can.Model.extend({
	findAll: 'GET /alerts'
}, {});
 
var AlertAction = can.Model.extend({
		findOne: 'GET /alertsaction/{id}'
}, {});


          
var Alerts = can.Control.extend({
	defaults: {},
	init: function(element, options){
		Alert.findAll({}, function(data){
			$(element).html(can.view("./templates/alerts.ejs",data));
			return false;
		});
	},
	'.criticalalertslink click': function(item, ev){
		Alert.findAll({type:"critical"}, function(data){
			$('.criticalalertssection .criticalalerts').html(can.view("./templates/alerts.ejs",data));
			return false;
		});
	},
	'.lesscriticalalertslink click': function(item, ev){
		Alert.findAll({type:"lesscritical"}, function(data){
			$('.criticalalertssection .criticalalerts').html(can.view("./templates/alerts.ejs",data));
			return false;
		});
	},
});
 var AlertActions = can.Control.extend({
		defaults: {},
		init: function(element, options){
			AlertAction.findOne({id: options.id}).done(function(data) {
				$( ".info"+options.id ).mouseout(function(event){
					event.stopImmediatePropagation();
						return false;
				});
				$( ".info"+options.id ).tooltip({
					items: "a",
					position: {
	                    my: "center bottom-20",
	                    at: "center left",
	                    using: function( position, feedback ) {
	                        $( this ).css( position );
	                        $( "<div>" )
	                                .addClass( "arrow" )
	                                .addClass( feedback.vertical )
	                                .addClass( feedback.horizontal )
	                                .appendTo( this );
	                    }
	                },
					show: { effect: "blind", duration: 100 },
					content: function() {
						return can.view("./templates/alerts_actions.ejs",data);
					},
					open: function( event, ui ) {
						$(".closehover").click(function(){
							$( ".info"+$(this).attr("id" )).tooltip( "close" );			
						});  
					}
				});
				$( ".info"+options.id ).tooltip( "open" );
				return false;
			});
		}
 });
 
 var Routing = can.Control.extend({
	  init: function(data) {
	    can.route('alerts');
	    new Alerts(".criticalalertssection", {id:data.id});

	  },
	  'alertsaction/:id route': function(data) {
	    new AlertActions(".info"+data.id, {id:data.id});
	  }
 });
var als = [{ id:0, duedate: "1/1/1", customer: "OMC1", reason: "Cancel" },
            { id:1, duedate: "1/1/1", customer: "OMC2", reason: "Cancel" } ];

       
can.fixture("GET /alerts", function(request){return als;});

var alertactioninfo = [
             { mobile: "123456789", customer: "test", home: "Not specified", account : "123456789" },
             { mobile: "123456789", customer: "test2", home: "Not specified", account : "123456789" }
         ];

var alertactioninfoStore = can.fixture.make(alertactioninfo.length, function(i) {
 	return {
 		data: alertactioninfo[i]
 	};
});

can.fixture({
 	"GET /alertsaction": alertactioninfoStore.findAll,
 	"GET /alertsaction/{id}": alertactioninfoStore.findOne
});

 // Let's drag this out a bit.
can.fixture.delay = 500;

 new Routing(document.body);


})();