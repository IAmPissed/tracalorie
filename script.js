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
        addItem(name, calories) {
            const id = data.foodItems.length > 0 ? data.foodItems[data.foodItems.length - 1].id + 1 : 0
            calories = parseInt(calories)
            const newFoodItem = new Item(id, name, calories)
            data.foodItems.push(newFoodItem)
            return newFoodItem
        },
        getTotalCalories() {
            const totalCalories = data.foodItems
                .map(foodItem => (foodItem.calories))
                .reduce((prev, curr) => prev + curr, 0)
            data.totalCalories = totalCalories
            return data.totalCalories
        },
        logData() {
            return data
        },

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
        totalCalories: '[data-total-calories]',
        cardButtonGroup: '[data-card-button-group]'
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
        renderFoodItem(foodItem) {
            const foodItemTemplate = document.querySelector(UISelectors.mealItemTemplate)
            const foodItemElement = foodItemTemplate.content.cloneNode(true)
            foodItemElement.firstElementChild.dataset.foodId = foodItem.id
            foodItemElement.querySelector(UISelectors.mealItemName).innerText = `${foodItem.name} :`
            foodItemElement.querySelector(UISelectors.mealItemCalories).innerText = foodItem.calories
            document.querySelector(UISelectors.mealItemsList).append(foodItemElement)
        },
        renderTotalCalories(totalCalories) {
            document.querySelector(UISelectors.totalCalories).innerText = totalCalories
        },
        getItemInput() {
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            }
        },
        clearInputs() {
            document.querySelector(UISelectors.itemNameInput).value = ''
            document.querySelector(UISelectors.itemCaloriesInput).value = ''
        },
        clearEditState() {
            UIController.clearInputs()
            if (document.querySelector(UISelectors.cardButtonGroup)) document.querySelector(UISelectors.cardButtonGroup).remove()
            document.querySelector(UISelectors.addMealItemButton).style.display = 'flex'
        },
        getSelectors() {
            return UISelectors
        }
    }
})()

const App = ((ItemController, UIController) => {

    const loadEventListeners = () => {
        const UISelectors = UIController.getSelectors()
        document.addEventListener('keypress', preventAddItemSubmitWhenEnterIsPressed)
        document.querySelector(UISelectors.addMealItemButton).addEventListener('click', handleAddItemSubmit)
    }

    const preventAddItemSubmitWhenEnterIsPressed = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            return
        }
    }

    const handleAddItemSubmit = (e) => {
        e.preventDefault()
        const { name, calories } = UIController.getItemInput()
        if (name === '' || calories === '') return
        if (isItemNameNotValid(name) || isItemCaloriesNotValid(calories)) return
        const newFoodItem = ItemController.addItem(name, calories)
        UIController.renderFoodItem(newFoodItem)
        const totalCalories = ItemController.getTotalCalories()
        UIController.renderTotalCalories(totalCalories)
        UIController.clearInputs()
    }
    const isItemNameNotValid = (name) => {
        return !/^[a-zA-Z\s]+$/.test(name)
    }
    const isItemCaloriesNotValid = (calories) => {
        return !/^[\d]+$/.test(calories)
    }

    return {
        initialize() {
            UIController.clearEditState()
            const foodItems = ItemController.getFoodItems()
            UIController.renderFoodItems(foodItems)
            const totalCalories = ItemController.getTotalCalories()
            UIController.renderTotalCalories(totalCalories)
            loadEventListeners()
        }
    }
})(ItemController, UIController)

App.initialize()