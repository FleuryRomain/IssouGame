// storing in an array the 8 colors used to fill game cards
var colors = [
	new BABYLON.Color3(1,0,0),
	new BABYLON.Color3(1,1,0),
	new BABYLON.Color3(1,0,1),
	new BABYLON.Color3(0,1,0),
	new BABYLON.Color3(0,1,1),
	new BABYLON.Color3(0,0,1),
	new BABYLON.Color3(1,1,1),
	new BABYLON.Color3(1,0.5,0)
];

// this is the array we will use to store card values
var gameArray = [0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7];

// shuffling the array. There are several ways to do it but it's not in the scope
// of this script, so I am using http://jsfromhell.com/array/shuffle 

shuffle = function(v){
    for(var j, x, i = v.length; i; j = parseInt(Math.random() * i), x = v[--i], v[i] = v[j], v[j] = x);
    return v;
};

gameArray = shuffle(gameArray);

// a counter to tell us how many animation have been completed so far
var animationCompleted = 0;
// counter to tell us how many cards we picked so far
var pickedCards=0;
// an array with the picked cards
var pickedArray = [];
// identifying the canvas id
var canvas = document.getElementById("gameCanvas");
// creation of the engine itself
var engine = new BABYLON.Engine(canvas,true);
// attaching a scene to the engine. This is where our game will take place
var scene = new BABYLON.Scene(engine);
// adding a little fog to the scene, to give some kind of "depth" to the scene
scene.fogMode = BABYLON.Scene.FOGMODE_EXP;
// the density is very high, so a low value is recommended
scene.fogDensity = 0.05;
// creation of a camera, the type is "AcrRotate".
// this mean the camera is bound along two arcs, one running from north to south, the other from east to west
// the first argument is the came of the camera instance
// the second argument is the angle along the north-south arc, in radians (3 * Math.PI / 2)
// the 3rd argumentis the angle along the east-west arc, in radians (3*Math.PI/4)
// the 4th argument is the radius of such arcs (20)
// the 5th argument is the camera target (BABYLON.Vector3.Zero()) in this case the origin
// finally, the scene where to attach the camera ("scene")
var camera = new BABYLON.ArcRotateCamera("camera",3 * Math.PI / 2, 11*Math.PI/16, 20, BABYLON.Vector3.Zero(), scene);
// adding touch controls to camera, that's where hand.js come into play
camera.attachControl(canvas, false);
// we need a directional light in order to cast a shadow
var light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(5,0,20), scene);
light.position = new BABYLON.Vector3(1,1,-10);
 
// this is the table material. We will map an image called "wood.jpg" on it
var tableMaterial = new BABYLON.StandardMaterial("tableMaterial", scene);
tableMaterial.diffuseTexture = new BABYLON.Texture("issou.jpeg", scene);

// THE TABLE
var table = BABYLON.Mesh.CreateBox("table", 12, scene);
table.scaling.z = 0.025;
table.material=tableMaterial;

// PLACING THE CARDS: 16 in a 4x4 matrix in this case
var cardsArray = [];
for(i=0;i<16;i++){
	var card = BABYLON.Mesh.CreateBox("card", 2, scene);
	// this is a custom attribute to know whether the card has been picked
	card.picked = false;
	// another custom attribute to determine card index
	card.cardIndex = i;
	// finally, assigning the card the most important color attribute: the value
	card.cardValue = gameArray[i];
	// scaling and placing the card
	card.scaling.z = 0.125;
	card.position = new BABYLON.Vector3((i%4)*2.5-3.75,Math.floor(i/4)*2.5-3.75,-0.25);
	// defining two different meshes, one for the bottom face and one for the rest of the card
	card.subMeshes=[];
	// arguments of Submesh are:
	// 1: the index of the material to use
	// 2: the index of the first vertex
	// 3: the number of verices used
	// 4: index of the first indice to use
	// 5: the number of indices
	// 6: the main mesh 
	card.subMeshes.push(new BABYLON.SubMesh(0, 4, 20, 6, 30, card));
	card.subMeshes.push(new BABYLON.SubMesh(1, 0, 4, 0, 6, card));
	// card material will be made with 2 different materials.
	// The first material is "cardMaterial", a grey color
	var cardMaterial = new BABYLON.StandardMaterial("cardMaterial", scene); 
	cardMaterial.diffuseColor = new BABYLON.Color3(0.5,0.5,0.5);
	// the second material is "cardBackMaterial", a the actual color color
	var cardBackMaterial = new BABYLON.StandardMaterial("cardBackMaterial", scene); 
	cardBackMaterial.diffuseColor = colors[gameArray[i]];
	// with these two colors in mind, let's built a multi material
	var cardMultiMat = new BABYLON.MultiMaterial("cardMulti", scene);
	// here is how we push the materials into a multimaterial
	cardMultiMat.subMaterials.push(cardMaterial);
	cardMultiMat.subMaterials.push(cardBackMaterial);
	// this is the content of our multi material - 0: CardMaterial, 1: CardBackMaterial
	// finally assigning the multi material to the card
	card.material=cardMultiMat;	
	cardsArray[i]=card;
}

// defining the animations

var firstCardMoveAnimation = new BABYLON.Animation(
	"1st card move animation", // name I gave to the animation 
	"position.z", // property I am going to change
	30, // animation speed
	BABYLON.Animation.ANIMATIONTYPE_FLOAT, // animation type
	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT // animation loop mode
	// play with BABYLON.Animation.ANIMATIONLOOPMODE_RELATIVE,
	// BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
	// BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

// just in case you want to give the 2nd card a different animation.
// not this case

var secondCardMoveAnimation = new BABYLON.Animation(
	"2nd card move animation",
	"position.z",
	30,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT,
	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var firstCardRotateAnimation = new BABYLON.Animation(
	"1st card rotate animation",
	"rotation.y", // this time I rotate the card around y axis
	30,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT,
	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

// just in case you want to give the 2nd card a different animation.
// not this case

var secondCardRotateAnimation = new BABYLON.Animation(
	"2nd card rotate animation",
	"rotation.y",
	30,
	BABYLON.Animation.ANIMATIONTYPE_FLOAT,
	BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
);

var animationsArray = [firstCardMoveAnimation,secondCardMoveAnimation,firstCardRotateAnimation,secondCardRotateAnimation];

// defining animations keyframes

var moveKeys = [
	{
		frame: 0,
		value: -0.25
	},
	{
		frame: 20,
		value: -2
	}
];

var moveBackKeys = [
	{
		frame: 0,
		value: -2
	},
	{
		frame: 20,
		value: -2
	},
	{
		frame: 40,
		value: -0.25
	}
];
    		
var rotateKeys = [
	{
		frame: 0,
        value: 0
	},
	{
		frame: 20,
        value: 0
	},
	{
		frame: 40,
        value: Math.PI
	}			    
]

var rotateBackKeys = [
	{
		frame: 0,
        value: Math.PI
	},
	{
		frame: 20,
        value: 0
	}		    
];
   
engine.runRenderLoop(function () {
	scene.render();
});

// a simple click listener
window.addEventListener("click", function (evt) {

	// with "scene.pick" we can obtain information about the stuff we picked/clicked 
	var pickResult = scene.pick(evt.clientX, evt.clientY);
	// if we haven't already picked two cards and we are picking a mesh and that mesh is called "card" and it's not picked yet...
	if(pickedCards<2 && pickResult.pickedMesh!=null && pickResult.pickedMesh.name==="card" && !pickResult.pickedMesh.picked){
		// getting card index
		var cardIndex = pickResult.pickedMesh.cardIndex;
		// set "picked" to true as we won't be able to pick it again
		cardsArray[cardIndex].picked = true;
		// storing the picked card in the array
    		pickedArray[pickedCards] = cardIndex;
    		// increase the amount of picked cards
		pickedCards++;    	
    		// adding keyframes to animation
		if(pickedCards===1){
			firstCardMoveAnimation.setKeys(moveKeys);
			firstCardRotateAnimation.setKeys(rotateKeys);
		}
		else{
			secondCardMoveAnimation.setKeys(moveKeys);
			secondCardRotateAnimation.setKeys(rotateKeys);
		}
		
		// adding animations to the card
		cardsArray[cardIndex].animations.push(animationsArray[pickedCards-1]);
    		cardsArray[cardIndex].animations.push(animationsArray[pickedCards+1]);

    		// launching animation, look at the "animCompleted" callback function
		scene.beginAnimation(cardsArray[cardIndex], 0, 40, false, 1, animCompleted);
		
    }
});

function animCompleted(){
	// increasing the number of completed animations
	animationCompleted++;
	// if the number of completed animations is 2, that is the animation of the
	// 2nd card is completed...
	if(animationCompleted===2){
		// reset animationCompleted value
		animationCompleted = 0; 
		// wait some time (a half second) before checking the match
		window.setTimeout(function(){
			if(cardsArray[pickedArray[0]].cardValue===cardsArray[pickedArray[1]].cardValue){
				// CARDS MATCH
				// remove the cards and let the player pick again
				// WIN ISSOU SOUND
				cardsArray[pickedArray[0]].dispose();
				cardsArray[pickedArray[1]].dispose();
				pickedArray = [];
					pickedCards=0;	
										
			}
			else{
				// CARDS DO NOT MATCH
				// turning back both cards, basically it's the same concept applied
				// as before when we was showing card colors
				// LOOSE ISSOU SOUND

				/*var sound = new BABYLON.Sound("Success", "success.mp3", scene, function(){
					sound.play();
				});*/
                var music = new BABYLON.Sound("Music", "success.wav", scene, null, { loop: true, autoplay: true });

				firstCardMoveAnimation.setKeys(moveBackKeys);
				firstCardRotateAnimation.setKeys(rotateBackKeys); 
				secondCardMoveAnimation.setKeys(moveBackKeys);
				secondCardRotateAnimation.setKeys(rotateBackKeys); 
				for(i=0;i<2;i++){
					cardsArray[pickedArray[i]].animations.push(animationsArray[i]);
	    				cardsArray[pickedArray[i]].animations.push(animationsArray[i+2]);
	    				// launching animation, look at the "// launching animation, look at the "animCompleted" callback function" callback function
	    				scene.beginAnimation(cardsArray[pickedArray[i]], 0, 40, false,1,animBackCompleted);	
				}
				
			
			}
		},500);
	}
}

function animBackCompleted(){
	// increasing the number of completed animations
	animationCompleted++;
	// if the number of completed animations is 2, that is the animation of the
	// 2nd card is completed...
	if(animationCompleted===2){
		// reset animationCompleted value
		animationCompleted = 0;
		// let the player pick again
		cardsArray[pickedArray[0]].animations=[];
	    	cardsArray[pickedArray[1]].animations=[];
	    	cardsArray[pickedArray[0]].picked=false;
	    	cardsArray[pickedArray[1]].picked=false;
	    	pickedArray = [];
	    	pickedCards=0;
	}	
}