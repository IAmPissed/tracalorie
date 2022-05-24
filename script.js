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
        getFoodItems() {
            return data.foodItems
        },
        logData() {
            return data
        }
    }
})()

const UIController = (() => {
    const UISelectors = {
        mealItemTemplate: '[data-meal-item-template]',
        mealItemsList: '[data-meal-items-list]',
        mealItemName: '[data-meal-item-name]',
        mealItemCalories: '[data-meal-item-calories]',
        addMealItemButton: '[data-add-meal-item-button]',
        itemNameInput: '[data-item-name-input]',
        itemCaloriesInput: '[data-item-calories-input]',
        totalCalories: '[data-total-calories]'
    }

    return {
        renderFoodItems(foodItems) {
            foodItems.forEach((foodItem) => {
                const foodItemTemplate = document.querySelector(UISelectors.mealItemTemplate)
                const foodItemElement = foodItemTemplate.content.cloneNode(true)
                foodItemElement.firstElementChild.dataset.foodId = foodItem.id
                foodItemElement.querySelector(UISelectors.mealItemName).innerText = `${foodItem.name} :`
                foodItemElement.querySelector(UISelectors.mealItemCalories).innerText = foodItem.calories
                document.querySelector(UISelectors.mealItemsList).append(foodItemElement)
            })
        },
        getSelectors() {
            return UISelectors
        }
    }
})()

const App = ((ItemController, UIController) => {
    const UISelectors = UIController.getSelectors()

    return {
        initialize() {
            const foodItems = ItemController.getFoodItems()
            UIController.renderFoodItems(foodItems)
        }
    }
})(ItemController, UIController)

App.initialize()