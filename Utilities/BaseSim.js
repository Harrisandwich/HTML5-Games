

	var tile = function()
    {
        this.x = 0;
        this.y = 0;
        this.size = 0;
        this.building;
        this.hovered = false;
        //the survivors working this tile
        this.survivorArray = new Array();
        //number of available work slots and max capacity
        this.openSlots = 1;
        this.maxSlots = 1;
        this.constructionInProgress = false;
        this.constructionProgress = 0;
        this.integrity = 0;

        /*
            Type Legend:
            ---------------
                0: Empty
                1: Town Center(default starting building)
                2: Farm
                3: Wall
                4: Outhouse
                5: Well
                6: Storage (Food)
                7: Storage (Water)
                8: Storage (Weapons)
                9: Storage (Comfort Items)
                10: Bunkhouse 
                11: Workshop
                12: Nursery
                13: Barracks
                14: Storage (Building Materials)
                   



            */

        /*
            TODO: Change "level 0" tiles to construction site picture. 
            level 1 is the full icon 
        */
        this.setImage = function()
        {
            
           
        }
        
        
    };
    
    var survivor = function()
    {   
        /*
        - List ID
                - where it sits in the button list (might just be the array index)
            - survivor stats
        - Morale
            - happiness and productivity
        - Farming
            - How they are at producing food
        - Combat 
            - how they are at defence (offence in the context of raids)
        - Scouting 
            - how they are at locating resources and other bases 
        - Building
            - How they are at constructing fortifications 
                - when a structure is created it doesn't start with full health 
                - the better the builder, the better the structures and maintenance*/

        this.morale = 0;
        this.farming = 0;
        this.combat = 0;
        this.scouting = 0;
        this.building = 0;
        this.health = 0;
        this.name = "";
        this.image = new Image();



    };

    var building = function()
    {

        /*
            Type Legend:
            ---------------
                0: Empty
                1: Town Center(default starting building)
                2: Farm
                3: Wall
                4: Outhouse
                5: Well
                6: Storage (Food)
                7: Storage (Water)
                8: Storage (Weapons)
                9: Storage (Comfort Items)
                10: Bunkhouse 
                11: Workshop
                12: Nursery
                13: Barracks
                14: Storage (Building Materials)
                   



            */
        /*
            
            - Name
                - the type of building
            - image 
                - building image 
            - integrity
                - basically the buildings "health"
            - level
                the level of the building 
            - workable
                - if the building needs workers to function
            - constructionInProgress
                - if the building is in construction mode
            - open slots
            - food production rate
            - water production rate
            - defense buff
            - morale buff
            - Food Storage 
            - Water Storage 
            - Weapon storage 
            - comfort item storage
            - building material storage
            - population increase
            - building training
            - farming training 
            - combat training

        */ 

        this.name = "";
        this.image = new Image();
        this.level = 0;
        this.integrity = 0;
        this.workable = false;
        this.constructionInProgress = false;
        this.openSlots = 0;
        this.foodProductionRate = 0;
        this.waterProductionRate = 0;
        this.defenseBuff = 0;
        this.moraleBuff = 0;
        this.foodStorage  = 0;
        this.waterStorage  = 0;
        this.weaponStorage  = 0;
        this.comfortItemStorage = 0;
        this.buildingMaterialStorage = 0;
        this.populationIncrease = 0;
        this.buildingTraining = 0;
        this.farmingTraining  = 0;
        this.combatTraining = 0;




         


    };

    var base = function()
    {

        /*
            - List ID
                - where it sits in the button list (might just be the array index)
            - Owner
                - the username of the player that runs the base
            - home base location 
                - the x and y coordinates of the base. 
            - Food
                - keeps survivors alive 
                - more food, more survivors you can have
            - Water 
                - keeps survivors alive 
                - more water, more survivors you can have
            - Defense 
                - how you hold up to raids or attacks 
            - Morale 
                - how productive your base is
                - average of survivor morale
            - Attraction
                - how likely you are to get survivors coming to your base 
            -storage 
                - how much you can store 
                - this is expressed as a max on resources
                    - ex: food: 100/200 200 being the max food storage space 
            - behind the scenes 
                - "level"
                    - how powerful the raids are 



            - resources
            ------------------
            - food
                - more survivors -food over time
            - water 
                - more survivors -water over time
            - weapons (general)
                - melee and projectile
                - + defence
                - Can send with scouts to ensure survival
            - comfort items (general)
                - + morale 
            - building materials
                - allows you to build new facilities and fortifications 
           

            */


    };

    var weapon = function()
    {

        /*
            name 
            image
            damage
            ??accuracy??

            accuracy would be a number between 1-100 
            
        */

        this.name = "";
        this.image = new Image();
        this.damage = 0;
        this.accuracy = 0; 
    };

    var survivorButton = function()
    {
        /*
            Made of:

            - a custom radio button
            - a survivor Object
            
            Displays:

            - survivor name
            - survivor picture
            - survivor stats

            When this button is clicked in the survivor list it is highlighted to indicate 
            selection. The survivor object is passed to a "selected survivor" pointer.

            When the player clicks the "assign" button they are taken to either...

                - A list of facilities 

                OR

                - the map of the base

                where they can select a facility to assign the survivor. 


        */

        this.draw = function()
        {


        };



    }

    var buildingButton = function()
    {

        /*
            Made of:

            - a custom radio button
            - a building Object
            
            Displays:

            - building name
            - building picture
            - building stats
            - building material costs


        */

    }

    var baseButton = function()
    {
        /*
            Made of:

            - a custom radio button
            - a base Object
            
            Displays:

            - Base name
            - Base Owner
            - Base stats


        */
        

    }



    var canvas = document.getElementById('myCanvas');
    var canvasContext = canvas.getContext('2d');
    var mouseClicked = false;
    var mouseX;
    var mouseY;
    var FRAMES_PER_SECOND = 60;
    var SECOND_IN_MILISECONDS = 1000;

    var gui = new GUIComponent();
    var backgroundImage = new Image();

    var survivorListButton;
    var buildListButton;
    var baseListButton;
    var miniMapButton;

    var ListPanel;
    var ListNavLeft;
    var ListNavRight;

    //selection radio button
    var selectionButtonOne;
    var selectionButtonTwo;
    var selectionButtonThree;
    var selectionButtonFour;
    var selectionButtonFive;

    var survivorListOpen = false;
    var buildListOpen = false;
    var baseListOpen = false;
    var weaponListOpen = false;
    var miniMapOpen = false;

    var tileArray = new Array();

    //Master lists for all items 
    //there is no survivor list because survivors are randomly generated. 
    var buildingMasterList = new Array();
    var weaponMasterList = new Array();

    //These hold all of the player owned items
    var survivorArray = new Array();
    var buildingArray = new Array();
    var weaponArray = new Array();
    var baseArray = new Array();

    //a second building array for all buildings constructed
    var buildingsPlaced = new Array();

    //pools of all weapons and buildings
    var weaponPool = new Array();
    var buildingPool = new Array();

    var selectedBuilding;
    var selectedSurvivor;
    var selectedWeapon;
    var selectedBase;

    var floor;
    var ceil;

    var colourRed = new colourObj();
    var colourGreen = new colourObj();
    var colourBlue = new colourObj();
    var colourGrey = new colourObj();
    var colourWhite = new colourObj();

    var valueWidth;

    /*
        Modes:
        ------------

        - View
            - Remove 
            - Upgrade
        - Build 
        - Assign
        
    */
    var mode = "view";




    canvas.addEventListener('mousedown',mouseDown,false);
    canvas.addEventListener('mouseup',mouseUp,false);
    canvas.addEventListener('mousemove',function(event)
    {
       
        mouseX = calculateMousePosition(event).x;
        mouseY = calculateMousePosition(event).y;
        
    });
    function calculateMousePosition(evt)
    {

        var rect = canvas.getBoundingClientRect();
        var root = document.documentElement;
        var mousePosX = evt.clientX- rect.left - root.scrollLeft;
        var mousePosY = evt.clientY- rect.top - root.scrollLeft;
        
        
        return {
            x:mousePosX,
            y:mousePosY
        }
    }
    function mouseDown(event)
    {
        mouseClicked = true;
    }
    function mouseUp(event)
    {
        mouseClicked = false;
    }


    start();

    function start()
    {
       

        

        colourRed.red = 255;
        colourGreen.green = 102;
        colourBlue.blue = 255;

        colourGrey.red = 100;
        colourGrey.blue = 100;
        colourGrey.green = 100;


        backgroundImage.src = "grass.jpg";
       

        //(x,y,onColour,offColour,labelColour,label,group,width,height)
        ListPanel = gui.createPanel(0,canvas.height-150,canvas.width,160,colourGrey);
        ListNavRight = gui.createRectButton(80,canvas.height-150,50,160,colourGrey,colourGreen,colourGreen);
        ListNavLeft = gui.createRectButton(canvas.width-200,canvas.height-150,50,160,colourGrey,colourGreen,colourGreen);

        

        survivorListButton = gui.createRadioButtonRect(0,canvas.height-150,colourGrey,colourRed,colourWhite,"Survivors","menus",75,40);
        buildListButton = gui.createRadioButtonRect(0,canvas.height-110,colourGrey,colourRed,colourWhite,"Buildings","menus",75,40);
        baseListButton = gui.createRadioButtonRect(0,canvas.height-70,colourGrey,colourRed,colourWhite,"Bases","menus",75,40);
        miniMapButton = gui.createRadioButtonRect(0,canvas.height-30,colourGrey,colourRed,colourWhite,"Map","menus",75,30);

        survivorListButton.labelX = 10;
        buildListButton.labelX =  10; 
        baseListButton.labelX =  10; 
        miniMapButton.labelX =  10; 

        survivorListButton.labelY = survivorListButton.height/2;
        buildListButton.labelY =buildListButton.height/2; 
        baseListButton.labelY = baseListButton.height/2; 
        miniMapButton.labelY = miniMapButton.height/2; 

        buildListButton.selected = true;

       

        survivorListButton.text = "Survivors";
        buildListButton.text = "Build"; 
        baseListButton.text = "Bases"; 
        miniMapButton.text = "Map";
                
        survivorListButton.action = showSurvivorList;
        buildListButton.action = showSurvivorList;
        baseListButton.action = showSurvivorList;


        generateSurvivorList();
        generateBuildingList();
        generateBaseList();
        generateGrid();

        setInterval(mainLoop,SECOND_IN_MILISECONDS/FRAMES_PER_SECOND);

    }

    function mainLoop()
    {
        drawEverything();
        updateEverything();
    }

    function drawEverything()
    {
         drawBackground();
         drawGrid();
         //drawGridOverlay();
         highlight();
        gui.draw();
    }

    function updateEverything()
    {
        gui.update(mouseX,mouseY,mouseClicked);

        if(survivorListButton.selected)
        {
            showSurvivorList();
        }
        else
        {
            hideSurvivorList();
        }
        
        
    }

    function drawBackground()
    {

        //drawRect(0,0,canvas.width,canvas.height,'black');
        drawImage(backgroundImage,0,0,canvas.width,canvas.height);
    }

    function drawGUIBackground()
    {

        drawRect(0,500,800,100,'grey');
    }

    function drawGridOverlay()
    {
        var brushX = 0;
        var brushY = 0;
        var tileSize = 50;
        var floor = canvas.height - 160;
       

        while(brushY < floor)
        {
            canvasContext.strokeStyle = 'white';
            canvasContext.fillStyle = 'black';
            canvasContext.strokeRect(brushX,brushY,tileSize,tileSize);
            brushX += 50
            if(brushX >= canvas.width)
            {
                brushX = 0;
                brushY += tileSize;
            }
        }
        

    }


    function drawGrid()
    {
        for(var i = 0; i < tileArray.length; i ++)
        {
            if(tileArray[i].type != 0)
            {
                // drawImage(tileArray[i].img,tileArray[i].x,tileArray[i].y,tileArray[i].size,tileArray[i].size);
            }
           
        }
    }

    

    function generateGrid()
    {
        var brushX = 0;
        var brushY = 0;
        var tileSize = 50;
        var floor = canvas.height - 160;
       

        while(brushY < floor)
        {
            var newTile = new tile();
            newTile.x = brushX;
            newTile.y = brushY;
            newTile.size = tileSize;
            tileArray.push(newTile);
            if(newTile.type != 0)
            {
                //drawImage(newTile.img,brushX,brushY,newTile.size,newTile.size);
            }
            
            brushX += 50
            if(brushX >= canvas.width)
            {
                brushX = 0;
                brushY += tileSize;
            }
        }

    }

    function highlight()
    {

        for(var i = 0; i < tileArray.length; i++)
        {
            
            if(mouseX > tileArray[i].x && mouseX < (tileArray[i].x + tileArray[i].size))
            {
               
                if(mouseY > tileArray[i].y && mouseY < (tileArray[i].y + tileArray[i].size))
                {
                    
                    canvasContext.strokeStyle = 'yellow';
                    canvasContext.fillStyle = 'black';
                    canvasContext.strokeRect(tileArray[i].x,tileArray[i].y ,tileArray[i].size,tileArray[i].size);
                    tileArray[i].hovered = true;

                    //check mode
                    //if build mode
                        //if click
                            //check if player has enough materials
                                //if so, place the building at level 0
                    //if view  mode
                        //if tile has a building
                            //select building and open remove/upgrade menu
                    //if assign mode
                        //if tile has workable building
                            //assign worker to that building


                }
            }

        }

    }
   

   /*
        list module design
        

        Option 1:

            5 list buttons comprised of 
                - a panel 
                - a radio button
                - a picture 
                - a label 
                - other info

            all elements will be stored in respective arrays

            the information on each button changes when the list is shifted

            will have to transfer which button is selected as the info shifts

        Option 2:

            seperate collections of radio buttons specific to the list they are a part of

            there would be an array of panels with all of the elements added to the element array

            buttons switch out and move and each hold a specific item. 

        in both cases there will be an array of the items the player currently has 
        and the information from that array will be mapped to the items 

        

        seperate GUI elements for each list

        two thresholds that, when passed, hide the buttons 


       


   */



    var maxItemsShown = 5;
    var buildingListModifier = 0; 

    var buildingListPanelsActive = new Array();

    
    function shiftListLeft()
    {
        if(buildListOpen)
        {
            if(buildingListModifier > 0)
            {
                buildingListModifier--;
            }
            refeshBuildingList();
        }
        
    }

    function shiftListRight()
    {
        if(buildListOpen)
        {
            if(buildingListModifier + maxItemsShown < buildingArray.length)
            {
                buildingListModifier++;
            }
            refeshBuildingList();
        }
    }

    function refeshBuildingList()
    {

        var buildingListPanelArray = new Array();
        
        //for every item in the players building list
        for(var i = 0 + buildingListModifier; i < maxItemsShown + buildingListModifier; i++)
        {
            //generate a panel, radio button, label etc
            //add elements to the panels element array
            //add panel to the survivorLisyPanelArray

            var panel = gui.createPanel(0,0,100,100,colourRed);
            var radioButton = gui.createRadioButtonRect(0,0,colourRed,colourBlue,colourGrey,"","building select",100,100);
            var label = gui.createLabel(0,0,buildingArray[i].name,"tiny",colourWhite);
            var thumbnail = gui.createImagePanel(0,0,32,32,buildingArray[i].image.src); 
               
        }

      

    }




    function generateRandomSurvivor(level)
    {
        /*

            Since survivors do not come from a pool i need to generate them on the fly 
            with varying skill levels. The 'level' parameter idicates how skilled the survivor is

        */




    }
    


     
    function generateBuildingPool()
    {
        /*
            Type Legend:
            ---------------
                0: Empty
                1: Town Center(default starting building)
                2: Farm
                3: Wall
                4: Outhouse
                5: Well
                6: Storage (Food)
                7: Storage (Water)
                8: Storage (Weapons)
                9: Storage (Comfort Items)
                10: Bunkhouse 
                11: Workshop
                12: Nursery
                13: Barracks
                14: Storage (Building Materials)
                      
        
           */

        var bl_1 = new building();
        var bl_2 = new building();
        var bl_3 = new building();
        var bl_4 = new building();
        var bl_5 = new building();
        var bl_6 = new building();
        var bl_7 = new building();
        var bl_8 = new building();
        var bl_9 = new building();
        var bl_10 = new building();
        var bl_11 = new building();
        var bl_12 = new building();
        var bl_13 = new building();

        bl_1.name = "Town Center";
        bl_1.image.src = "";

        bl_2.name = "Farm";
        bl_2.image.src = "";

        bl_3.name = "Wall";
        bl_3.image.src = "";

        bl_4.name = "Outhouse";
        bl_4.image.src = "";

        bl_5.name = "Storage (Food)";
        bl_5.image.src = "";

        bl_6.name = "Storage (Water)";
        bl_6.image.src = "";

        bl_7.name = "Storage (Weapons)";
        bl_7.image.src = "";

        bl_8.name = "Storage (Comfort Items)";
        bl_8.image.src = "";

        bl_9.name = "Storage (Building Materials)";
        bl_9.image.src = "";

        bl_10.name = "Bunkhouse";
        bl_10.image.src = "";

        bl_11.name = "Workshop";
        bl_11.image.src = "";

        bl_12.name = "Nursery";
        bl_12.image.src = "";

        bl_13.name = "Barracks";
        bl_13.image.src = "";








    }

    function generateWeaponPool()
    {
        /*
         name 
            image
            damage
            ??accuracy??

            accuracy would be a number between 1-100 


            current weapons:

                - baseball bat
                - crowbar
                - board with nail 
                - pocket knife
                - hunting knife
                - machete
                - 9mm pistol 
                - revolver 
                - SMG
                - Hunting rifle 



            */

            var w_1 = new weapon();
            var w_2 = new weapon();
            var w_3 = new weapon();
            var w_4 = new weapon();
            var w_5 = new weapon();
            var w_6 = new weapon();
            var w_7 = new weapon();
            var w_8 = new weapon();
            var w_9 = new weapon();
            var w_10 = new weapon();

            w_1.name = "Baseball Bat";
            w_1.image.src = "";
            w_1.damage = 3;
            w_1.accuracy = 0;

            w_2.name = "Crowbar";
            w_2.image.src = "";
            w_2.damage = 4;
            w_2.accuracy = 0;

            w_3.name = "Board With Nail";
            w_3.image.src = "";
            w_3.damage = 1;
            w_3.accuracy = 0;

            w_4.name = "Pocket Knife";
            w_4.image.src = "";
            w_4.damage = 5;
            w_4.accuracy = 0;

            w_5.name = "Hunting Knife";
            w_5.image.src = "";
            w_5.damage = 6;
            w_5.accuracy = 0;

            w_6.name = "Machete";
            w_6.image.src = "";
            w_6.damage = 7;
            w_6.accuracy = 0;

            w_7.name = "9mm Pistol";
            w_7.image.src = "";
            w_7.damage = 8;
            w_7.accuracy = 0;

            w_8.name = "Revolver";
            w_8.image.src = "";
            w_8.damage = 9;
            w_8.accuracy = 0;

            w_9.name = "SMG";
            w_9.image.src = "";
            w_9.damage = 11;
            w_9.accuracy = 0;

            w_10.name = "Hunting Rifle";
            w_10.image.src = "";
            w_10.damage = 14;
            w_10.accuracy = 0;


            weaponPool.push(w_1);
            weaponPool.push(w_2);
            weaponPool.push(w_3);
            weaponPool.push(w_4);
            weaponPool.push(w_5);
            weaponPool.push(w_6);
            weaponPool.push(w_7);
            weaponPool.push(w_8);
            weaponPool.push(w_9);
            weaponPool.push(w_10);

        

    }   

    //change all of these to only show the 'shown' arrays 
    function showSurvivorList()
    {
        for(var i = 0; i < survivorListElementArray.length;i++)
        {
            survivorListElementArray[i].show();
        }

    }

     function hideSurvivorList()
    {
        for(var i = 0; i < survivorListElementArray.length;i++)
        {
            survivorListElementArray[i].hide()
        }

    }

    function showBuildingList()
    {
        for(var i = 0; i < buildingListElementArray.length;i++)
        {
            buildingListPanelsActive[i].visible = true;
        }

    }

     function hideBuildingList()
    {
        for(var i = 0; i < buildingListElementArray.length;i++)
        {
            buildingListPanelsActive[i].visible = false;
        }

    }

   

     function showBaseList()
    {
        for(var i = 0; i < baseListElementArray.length;i++)
        {
            baseListElementArray[i].visible = true;
        }

    }

     function hideBaseList()
    {
        for(var i = 0; i < baseListElementArray.length;i++)
        {
            baseListElementArray[i].visible = false;
        }

    }
