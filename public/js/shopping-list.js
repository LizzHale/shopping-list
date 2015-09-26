var ShoppingList = function() {
    this.items = [];
    this.itemList = $('#item-list');
    this.itemListTemplate = Handlebars.compile($("#item-list-template").html());
    this.input = $('#item-input');
    this.input.keydown(this.onAddInputKeydown.bind(this));
    this.main = $('#main');
    this.main.on('dblclick', 'li',
        this.onEditItemClicked.bind(this));
    this.main.on('keydown', 'li input',
        this.onEditInputKeydown.bind(this));
    this.main.on('focusout', 'li input',
        this.onEditFocusOut.bind(this));
    this.main.on('click', 'li .delete-item',
        this.onDeleteItemClicked.bind(this));
    this.getItems();
};
ShoppingList.prototype.onAddInputKeydown = function(event) {
    if (event.which != 13) {
        return;
    }
    var input = $(event.target);
    var value = input.val().trim();
    if (value != '') {
        this.addItem(value);
    }
    input.val('');
    event.preventDefault();
};
ShoppingList.prototype.onEditItemClicked = function(event) {
    var item = $(event.target).parents('li');
    var display = item.children('.display');
    var input = item.children('input');
    var name = display.children('.name');
    input.show();
    input.focus();
    input.val(name.text());
    display.hide();
    event.preventDefault();
};
ShoppingList.prototype.onEditInputKeydown = function(event) {
    if (event.which != 13) {
        return;
    }
    var input = $(event.target);
    input.blur();
};
ShoppingList.prototype.onEditFocusOut = function(event) {
    var item = $(event.target).parents('li');
    var id = item.data('id');
    var display = item.children('.display');
    var input = item.children('input');
    var name = display.children('.name');
    var value = input.val().trim();
    if (value != '') {
        this.editItem(id, value);
        name.text(value);
    }
    input.hide();
    display.show();
    event.preventDefault();
};
ShoppingList.prototype.onDeleteItemClicked = function(event) {
    var id = $(event.target).parents('li').data('id');
    this.deleteItem(id);
};
ShoppingList.prototype.getItems = function() {
    var ajax = $.ajax('/items', {
        type: 'GET',
        dataType: 'json'
    });
    ajax.done(this.onGetItemsDone.bind(this));
};
ShoppingList.prototype.addItem = function(name) {
    var item = {'name': name};
    var ajax = $.ajax('/items', {
        type: 'POST',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(this.getItems.bind(this));
};
ShoppingList.prototype.deleteItem = function(id) {
    var ajax = $.ajax('/items/' + id, {
        type: 'DELETE',
        dataType: 'json'
    });
    ajax.done(this.getItems.bind(this));
};
ShoppingList.prototype.editItem = function(id, name) {
    var item = {'name': name, 'id': id};
    var ajax = $.ajax('/items/' + id, {
        type: 'PUT',
        data: JSON.stringify(item),
        dataType: 'json',
        contentType: 'application/json'
    });
    ajax.done(this.getItems.bind(this));
};
ShoppingList.prototype.onGetItemsDone = function(items) {
    this.items = items;
    this.updateItemsView();
};
ShoppingList.prototype.updateItemsView = function() {
    var context = {
        items: this.items
    };
    var itemList = $(this.itemListTemplate(context));
    this.itemList.replaceWith(itemList);
    this.itemList = itemList;
};
$(document).ready(function() {
    var app = new ShoppingList();
});