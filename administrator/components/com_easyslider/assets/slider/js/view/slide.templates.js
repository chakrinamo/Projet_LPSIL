void function(exports,$){exports.JSNES_SlideTemplatesView=Backbone.CollectionView.extend({initialize:function(){this.collection.fetch()},itemView:Backbone.ItemView.extend({className:"jsn-es-templates-slide",template:"#template-slide-template",tagName:"div",initialize:function(){this.defer(this.render)},events:{click:function(){this.model.destroy()}}})})}(this,JSNESjQuery);