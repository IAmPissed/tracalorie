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
        getFoodItemById(id) {
            const selectedFoodItem = data.foodItems.find((foodItem) => (foodItem.id === id))
            return selectedFoodItem
        },
        setCurrentItem(item) {
            data.currentFoodItem = item
        },
        getCurrentItem() {
            return {
                name: data.currentFoodItem.name,
                calories: data.currentFoodItem.calories
            }
        },
        updateFoodItem(name, calories) {
            calories = parseInt(calories)
            const foodItemToUpdate = data.foodItems.find((foodItem) => (foodItem.id === data.currentFoodItem.id))
            foodItemToUpdate.name = name
            foodItemToUpdate.calories = calories
            foodItemToUpdate.updatedAt = new Intl.DateTimeFormat(undefined, { dateStyle: 'full', timeStyle: 'medium' }).format(new Date())
            return foodItemToUpdate
        },
        logData() {
            return data
        },

    }
})()

const UIController = (() => {
    const UISelectors = {
        controlButtonsTemplate: '[data-control-buttons-template]',
        addMealItemButton: '[data-add-meal-item-button]',
        itemCaloriesInput: '[data-item-calories-input]',
        mealItemTemplate: '[data-meal-item-template]',
        mealItemCalories: '[data-meal-item-calories]',
        updateItemButton: '[data-update-item-button]',
        deleteItemButton: '[data-delete-item-button]',
        cardButtonGroup: '[data-card-button-group]',
        foodItemElement: '[data-food-item]',
        itemEditButton: '[data-edit-meal-item-button]',
        totalCalories: '[data-total-calories]',
        mealItemsList: '[data-meal-items-list]',
        foodItemsList: '[data-meal-items-list]',
        itemNameInput: '[data-item-name-input]',
        mealItemName: '[data-meal-item-name]',
        backButton: '[data-back-button]',
        mealForm: '[data-meal-form]',
    }

    return {
        addItemToForm() {
            const { name, calories } = ItemController.getCurrentItem()
            document.querySelector(UISelectors.itemNameInput).value = name
            document.querySelector(UISelectors.itemCaloriesInput).value = calories
        },
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
        showEditState() {
            const controlButtonsTemplate = document.querySelector(UISelectors.controlButtonsTemplate)
            const controlButtonsElement = controlButtonsTemplate.content.cloneNode(true)
            document.querySelector(UISelectors.addMealItemButton).style.display = 'none'
            document.querySelector(UISelectors.mealForm).append(controlButtonsElement)
        },
        updateFoodItem(item) {
            const foodItems = Array.from(document.querySelectorAll(UISelectors.foodItemElement))
            foodItems.forEach(foodItem => {
                const foodItemId = parseInt(foodItem.dataset.foodId)
                if (foodItemId === item.id) {
                    const foodItemToEdit = document.querySelector(`[data-food-id="${foodItemId}"]`)
                    foodItemToEdit.querySelector(UISelectors.mealItemName).innerText = `${item.name} : `
                    foodItemToEdit.querySelector(UISelectors.mealItemCalories).innerText = item.calories
                }
            })
        },
        getSelectors() {
            return UISelectors
        }
    }
})()

const App = ((ItemController, UIController) => {
    const UISelectors = UIController.getSelectors()

    const loadEventListeners = () => {
        document.addEventListener('keypress', preventAddItemSubmitWhenEnterIsPressed)
        document.querySelector(UISelectors.addMealItemButton).addEventListener('click', handleAddItemSubmit)
        document.querySelector(UISelectors.foodItemsList).addEventListener('click', handleItemEditSubmit)
        document.querySelector(UISelectors.mealForm).addEventListener('click', handleSubmit)
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

    const handleItemEditSubmit = (e) => {
        if (e.target.matches(UISelectors.itemEditButton)) {
            const foodId = parseInt(e.target.parentElement.dataset.foodId)
            const selectedFoodItemToEdit = ItemController.getFoodItemById(foodId)
            ItemController.setCurrentItem(selectedFoodItemToEdit)
            UIController.addItemToForm()
            UIController.showEditState()
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (isUpdateItemButton(e)) handleItemUpdateSubmit()
        if (isBackButton(e)) UIController.clearEditState()
    }
    const isUpdateItemButton = (e) => {
        return e.target.matches(UISelectors.updateItemButton)
    }
    const handleItemUpdateSubmit = () => {
        const { name, calories } = UIController.getItemInput()
        if (isItemNameNotValid(name) || isItemCaloriesNotValid(calories)) return
        const updatedFoodItem = ItemController.updateFoodItem(name, calories)
        UIController.updateFoodItem(updatedFoodItem)
        const totalCalories = ItemController.getTotalCalories()
        UIController.renderTotalCalories(totalCalories)
        UIController.clearEditState()
    }
    const isBackButton = (e) => {
        return e.target.matches(UISelectors.backButton)
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