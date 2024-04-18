class Start extends Scene {
    create() {
        this.engine.setTitle(this.engine.storyData.Title); // TODO: replace this text using this.engine.storyData to find the story title
        this.engine.addChoice("Begin the story"); 
    }

    handleChoice() {
        this.engine.gotoScene(Location,this.engine.storyData.InitialLocation);
    }
}

class Location extends Scene {
    create(key) {
        let inventory = this.engine.storyData.Inventory;
        let locationData = this.engine.storyData.Locations[key];
        this.engine.show(locationData.Body);
        if(locationData.Choices != undefined) { 
            for(let choice of locationData.Choices) {
                if(choice.GameWorldItem != undefined){
                    let invin;
                    for(let i of inventory){
                        if(i == choice.GameWorldItem){
                            invin = true;
                            break;
                        }
                    }
                    if(!invin){
                    this.engine.addChoice(choice.Text,choice);
                    }
                }else if(choice.Lock != undefined){
                    if(inventory != undefined){
                        for(let i of inventory){
                            if(choice.Lock == i){
                                this.engine.addChoice(choice.Text,choice);
                            }
                        }
                    }
                } else {
                    this.engine.addChoice(choice.Text,choice);
                }
            }
        } else {
            this.engine.addChoice("The end.")
        }
    }

    handleChoice(choice) {
        if(choice) {  
            let inventory = this.engine.storyData.Inventory;
            this.engine.show("&gt; "+choice.Text);
            if(choice.GameWorldItem != undefined){
                if(choice.GameWorldItem == "Axe" && !inventory.includes("Coin")){
                    this.engine.gotoScene(Location, choice.Target[1]);
                }else if(choice.GameWorldItem == "Axe"){
                    this.engine.gotoScene(Location, choice.Target[0]);
                    inventory.push(choice.GameWorldItem);
                } else{
                    inventory.push(choice.GameWorldItem);
                    this.engine.gotoScene(Location, choice.Target); 
                }
            } else if(choice.Split == "Path"){
                if(inventory.includes("Axe")){
                    this.engine.gotoScene(Location,choice.Target[1]);
                } else{
                    this.engine.gotoScene(Location,choice.Target[0]);
                }
            } else {
                this.engine.gotoScene(Location, choice.Target); 
            }
        } else{
            this.engine.gotoScene(End);
        }
    }
}

class End extends Scene {
    create() {
        this.engine.show("<hr>");
        this.engine.show("Congratulations you beat the game!");
        this.engine.show("You ended with these items " + this.engine.storyData.Inventory);
    }
}

Engine.load(Start, 'myStory.json');