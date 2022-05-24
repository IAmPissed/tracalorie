const ItemController = (() => {
    function Item(id, name, calories) {
        this.id = id
        this.name = name
        this.calories = calories
        this.createdAt = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())
        this.updatedAt = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())
    }

    const data = {
        foodItems: [],
        currentFoodItem: null,
        totalCalories: 0
    }

    return {
        logData() {
            return data
        }
    }
})()

const UIController = (() => {

})()

const App = ((ItemController, UIController) => {

    return {
        initialize() {
            console.log(ItemController.logData())
        }
    }
})(ItemController, UIController)

App.initialize()