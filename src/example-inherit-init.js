
function Parent() {
 this.init();
}

Parent.prototype.init = function () {
  console.log('init parent');
  this.a = 1;
}

function Child() {
  this.init();
}
Child.prototype = Object.create(Parent.prototype);
Child.prototype.constructor=Child;

Child.prototype.init = function (){
  Parent.prototype.init.apply(this, arguments);
  this.b = 3
  }

//

class Parent {
  init() {
  console.log('init parent');
  this.a = 1;
  }
}

class Child extends Parent {
  init() {
  super.init();
    console.log('init child')
  this.b = 3
  }
}
