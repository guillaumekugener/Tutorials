var Modifier = require('famous/core/Modifier');
var StateModifier = require('famous/modifiers/StateModifier');
 
__original_modify = Modifier.prototype.modify;
 
Modifier.prototype.modify = function extended_modify(target) {
  __original_modify.call(this,target);
  
  // here is the hack: set target to NULL if it should not be visible!
  if(this._visibleGetter) this.visible = this._visibleGetter();
  this._output.target = this.visible === undefined || this.visible? target: null;
  
  return this._output;
};
 
Modifier.prototype.visibleFrom = function(visible){
    if (visible instanceof Function) this._visibleGetter = visible;
    else if (visible instanceof Object && visible.get) this._visibleGetter = visible.get.bind(visible);
    else {
        this._visibleGetter = null;
        this.visible = visible;
    }
    return this;
};
 
StateModifier.prototype.setVisible = function(value) {
  this._modifier.visible = value;
};