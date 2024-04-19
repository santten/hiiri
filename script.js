console.log("Opened Hiiri 1.0 :)")

/* areas */
const titleArea = document.querySelector("#titleArea")
const modifierFields = document.querySelector("#modifierFields")
const mainTools = document.querySelector("#mainTools")
const paletteArea = document.querySelector("#paletteArea")
const fileTools = document.querySelector("#fileTools")
const coordinateArea = document.querySelector("#coordinateArea")
const themeSwitchArea = document.querySelector("#themeSwitchArea")


/* canvas */
const canvas = document.querySelector("canvas")
const ctx = canvas.getContext('2d');
ctx.imageSmoothingEnabled = false;


/* drawing settings */
let bgColor = "white";
let snapshots = []
let oldsnapshot = []
let prevMouseX, prevMouseY;
let isPressed = false;
let toolSelected = "default";
paletteList = ["black", "white", "red", "palevioletred", "yellow", "sandybrown", "lawngreen", "darkturquoise", "royalblue", "cornflowerblue", "purple", "plum"]
let currentColor = paletteList[0]
let selectColor = currentColor
let lastLine = []
let lineWidth = 2
ctx.lineCap = "butt";
let defaultWidth = 520;
let defaultHeight = 320;
canvas.width = defaultWidth;
canvas.height = defaultHeight;
let snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
let textContent = "";
let fontSize = "20"

let currentfield = document.querySelector("#currentColor")
currentfield.style.backgroundColor = currentColor

/* create number field modifiers */
const brushWidthField = document.createElement("input")
brushWidthField.type = "number"
brushWidthField.id = "numberField"
brushWidthField.value = lineWidth
brushWidthField.className = "field"

brushWidthField.addEventListener("change", function(){
	const value = Math.floor(brushWidthField.value)
	if (value < 64 && value > 0){
		brushWidthField.value = value
		lineWidth = value
	}
	else if (value > 64) {
			brushWidthField.value = 64
			lineWidth = 64}
	else {
		brushWidthField.value = 1
		lineWidth = 1}
	
})
let widthExplanation = document.createElement("span")
widthExplanation.innerHTML = "Brush Width" 
widthExplanation.className = "fieldTitle"
modifierFields.appendChild(widthExplanation)
modifierFields.appendChild(brushWidthField)


/* create canvas width modifiers */
const canvasWidthField = document.createElement("input")
canvasWidthField.type = "number"
canvasWidthField.id = "numberField"
canvasWidthField.value = canvas.width
canvasWidthField.className = "field"
canvasWidthField.addEventListener("change", function(){
	const value = Math.floor(canvasWidthField.value)
	if (value < 1000 && value > 50){
		snapshot = ctx.getImageData(0, 0, canvas.height,canvas.width)
		snapshots.push(snapshot)
		canvasWidthField.value = value
		canvas.width = value
		ctx.putImageData(snapshots[snapshots.length - 1], 0, 0);
	}
	else if (value > 1000) {
		snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		snapshots.push(snapshot)
		canvasWidthField.value = 1000
		canvas.width = value
		ctx.putImageData(snapshots[snapshots.length - 1], 0, 0);
}
	else {
		snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		snapshots.push(snapshot)
		canvasWidthField.value = 50
		canvas.width = value
		ctx.putImageData(snapshots[snapshots.length - 1], 0, 0);
}})

const canvasHeightField = document.createElement("input")
canvasHeightField.type = "number"
canvasHeightField.id = "numberField"
canvasHeightField.value = lineWidth
canvasHeightField.className = "field"
canvasHeightField.value = canvas.height;

canvasHeightField.addEventListener("change", function(){
	const value = Math.floor(canvasHeightField.value)
	if (value < 1000 && value > 50){
		snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		snapshots.push(snapshot)
		canvasHeightField.value = value
		canvas.height = value;
	}
	else if (value > 1000) {
			snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		canvasHeightField.value = 1000
		canvas.height = value
			snapshots.push(snapshot)
	}
	else {
		snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		snapshots.push(snapshot)
		canvasHeightField.value = 50
		canvas.height = value
		}
		ctx.putImageData(snapshots[snapshots.length -1], 0, 0);
	
})

widthExplanation = document.createElement("span")
widthExplanation.innerHTML = "Canvas Size" 
widthExplanation.className = "fieldTitle"
modifierFields.appendChild(widthExplanation)
modifierFields.appendChild(canvasHeightField)
modifierFields.appendChild(canvasWidthField)



/* filetools */

const fileToolsList = [
	{
		"idName": "Clear",
		"functionName": clear,
		"toolTip": "Clear Canvas",
	},
	{
		"idName": "Undo",
		"functionName": undo,
		"toolTip": "Undo Last Action [CTRL + Z]",
	},
	{
		"idName": "Save as PNG",
		"functionName": downloadPng,
		"toolTip": "Download as PNG [CTRL + P]",
	}, 	
]

for (let i = 0; i < fileToolsList.length; i++){
	let thisButton = document.createElement("button")
	thisButton.innerHTML = fileToolsList[i].idName
	thisButton.id = fileToolsList[i].idName
	thisButton.addEventListener("click", function(){fileToolsList[i].functionName()})
	
	let toolTip = document.createElement("span")
	toolTip.className = "toolTip"
	toolTip.innerHTML = fileToolsList[i].toolTip
	thisButton.appendChild(toolTip)

	fileTools.appendChild(thisButton)

}


function clear() {
	canvas.height = defaultHeight;
	canvasHeightField.value = defaultHeight;
	canvas.width = defaultWidth;
	canvasWidthField.value = defaultWidth;
	ctx.fillStyle = bgColor
	ctx.fillRect(0, 0, canvas.height, canvas.width)
	snapshot = [];
	oldsnapshot = [];
	snapshots = []
}

function undo() {
	if (snapshots.length == 1){
		clear()
	}
	else if (snapshots.length > 1){
		snapshots.pop()
		ctx.putImageData(snapshots[snapshots.length - 1], 0, 0)
	}
	else {
		
    }
}

function downloadPng() {
	const downloadLink = document.createElement('a');
	downloadLink.setAttribute('download', 'CanvasImage.png');
	const dataURL = canvas.toDataURL('image/png');
	downloadLink.setAttribute('href', dataURL);
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

/* mainTools */
toolsList = [
	{"name": "Default",
	"value": "default",
	"type": "brush",
	"tooltip": "Default Pen [B]"
	},
	{"name": "Line",
	"value": "line",
	"type": "brush",
	"tooltip": "Line Tool [L]"
	},
	{"name": "Rect",
	"value": "rectangle",
	"type": "brush",
	"tooltip": "Rectangle Tool [R]"
	},
	{"name": "F.Rect",
	"value": "frectangle",
	"type": "brush",
	"tooltip": "Full Rectangle Tool [Shift + R]"
	},
	{"name": "Eraser",
	"value": "eraser",
	"type": "brush",
	"tooltip": 'Eraser Tool [E]'
	},
	{"name": "Text",
	"value": "texttool",
	"type": "brush",
	"tooltip": "Add Text [SHIFT + ALT]"},
]

for (let i = 0; i < toolsList.length; i++) {
	const toolButton = document.createElement("button")
	toolButton.className = "toolButton"
	toolButton.id = toolsList[i]["value"]
	toolButton.innerHTML = toolsList[i]["name"]
	
	if (toolsList[i]["type"] === "brush"){
		toolButton.addEventListener('click', function(){
		toolSelected = toolsList[i]["value"]
		if (toolsList[i]["value"] === "texttool"){
			openDialogue()
		}
	})}


	
	const toolTip = document.createElement("span")
	toolTip.className = "toolTip"
	toolTip.innerHTML = toolsList[i]["tooltip"]
	toolButton.appendChild(toolTip)
	
	mainTools.appendChild(toolButton)
}



/* palette button creation */
for (let i = 0; i < paletteList.length; i++) {
	const colorButton = document.createElement("button")
	colorButton.className = "colorButton"
	colorButton.id = paletteList[i]
	colorButton.style.backgroundColor = paletteList[i]
		
	colorButton.addEventListener("click", function() {
		selectColor = paletteList[i]
        currentfield.style.backgroundColor = selectColor
        currentColor = selectColor
		})
	paletteArea.appendChild(colorButton)
}		



window.addEventListener("load", () => {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
});



function startDrawing(evt) {
	snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
	snapshots.push(snapshot)


	if (event.button === 2){
		event.preventDefault()
		let selectColor = currentColor;
		currentColor = bgColor;
	}
	else {
		if(selectColor !== currentColor){
			currentColor = selectColor;
		}
	}

	prevMouseX = evt.offsetX;
	prevMouseY = evt.offsetY; 
	ctx.lineWidth = lineWidth;
	ctx.strokeStyle = currentColor;
    ctx.fillStyle = currentColor;
	isPressed = true

	ctx.beginPath()

}


function drawing(evt) {
coordinateArea.innerHTML = `(${evt.offsetX}, ${evt.offsetY})`;

	if (isPressed) {
switch (toolSelected) {
	case "default":
		ctx.lineTo(evt.offsetX, evt.offsetY)
		ctx.stroke()
		break;
	case "fill":
		fill(evt.offsetX, evt.offsetY)
		break;
	case "eraser":
	    eraser(evt)
		break;
	case "line":
		line(evt)
		break;
	case "rectangle":
		rectangle(evt, "n")
		break;
	case "frectangle":
		rectangle(evt, "f")
		break;
	case "texttool":
		textAdd(evt)
		break;	
}
}
}


function eraser(evt) {
	ctx.lineWidth = lineWidth + 2;
	ctx.strokeStyle = bgColor
	ctx.lineTo(evt.offsetX, evt.offsetY)
	ctx.putImageData(snapshot, 0, 0)
	ctx.stroke();
	ctx.lineWidth = lineWidth;
}

function line(evt) {
	ctx.beginPath()
	ctx.moveTo(prevMouseX, prevMouseY)
	ctx.lineTo(evt.offsetX, evt.offsetY)
	ctx.putImageData(snapshot, 0, 0) 
	ctx.stroke()
}

function rectangle(evt, value){
	ctx.beginPath()
    ctx.rect(prevMouseX, prevMouseY, (evt.offsetX - prevMouseX), (evt.offsetY - prevMouseY))
    ctx.putImageData(snapshot, 0, 0)
	if (value === "f"){
        ctx.fill()
    }
    else{
    ctx.stroke()}
}

fontList = ['Arial', 'Serif', 'Helvetica', 'Exo 2', 'Verdana']
function openDialogue() {
	let dialog = document.querySelector("#addText")
			dialog.innerHTML = ""
			
			let myForm = document.createElement("form") 
			let textField = document.createElement("textarea")
			let fontForm = document.createElement("select")
			
			textField.style.color = currentColor
			textField.type = "text";
			textField.id = "textContent";
			textField.value = textContent
			
			for (let i = 0; i < fontList.length; i++){
				let myOption = document.createElement("option")
				myOption.label = fontList[i]
				myOption.value = fontList[i]
				myOption.id = fontList[i]
				fontForm.appendChild(myOption)
			}
			fontForm.id = "fontForm"
			fontForm.label = "Font:"
			
			fontForm.addEventListener("change", function(evt){
				textField.style.fontFamily = fontForm.value
			})


			const fontSizeField = document.createElement("input")
			fontSizeField.type = "number"
			fontSizeField.id = "numberField"
			fontSizeField.value = fontSize
			fontSizeField.className = "field"

			fontSizeField.addEventListener("input", function(){
				let value = fontSizeField.value
				if (value < 150 && value > 0){
					fontSizeField.value = value
					textField.style.fontSize = value +"px"
					fontSize = value;
				}
				if (value <= 0){
					fontSizeField.value = 1;
					textField.style.fontSize = 1 +"px"
					fontSize = 1;
				}
				if (value > 150){
					fontSizeField.value = 150;
					textField.style.fontSize = 150 +"px"
					fontSize = 150;
				}
			})

			modifierFields.appendChild(fontSizeField)



			
			let submitButton = document.createElement("input")
			submitButton.type = "submit"
			submitButton.value = "Add Text"
            submitButton.id = "addtext"
			
			myForm.appendChild(fontForm)
			myForm.appendChild(fontSizeField)
			myForm.appendChild(textField)
			myForm.appendChild(submitButton)
			dialog.appendChild(myForm)
			
			myForm.addEventListener("submit", function(evt){
				evt.preventDefault()
				textContent = textField.value
				chosenFont = fontForm.value
				dialog.close()
				toolSelected = "texttool"
			})
			dialog.showModal()
}

function textAdd(evt){
	ctx.beginPath()
	ctx.font = `${fontSize}px ${chosenFont}`;
	ctx.fillStyle = currentColor;
	ctx.putImageData(snapshot, 0, 0)
	ctx.fillText(textContent, evt.offsetX, evt.offsetY)	
}

function drawingOver(evt){
		snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height)
		snapshots.pop()
		snapshots.push(snapshot)

	if (isPressed) {
		isPressed = false
		ctx.stroke()
	ctx.putImageData(snapshot, 0, 0)}
}



/* coordinate tracking */

canvas.addEventListener ("mousedown", function(evt){
	startDrawing(evt)
	})
	
canvas.addEventListener("mousemove", function(evt){
	drawing(evt)
	});
	
window.addEventListener("mouseup", function(evt){
	drawingOver(evt)
	});
	
let shortcutLine = "l"
let shortcutDefault = "b"
let shortcutEraser = "e"	
let shortcutRectangle = "r"

window.addEventListener("keydown", function(evt){
	if (evt.ctrlKey && (evt.key == "z")){
		undo()
	}
	if (evt.key == shortcutLine){
		toolSelected = "line"
	}
	if (evt.key == shortcutDefault){
		toolSelected = "default"
	}
	if (evt.key == shortcutEraser){
		toolSelected = "eraser"
	}
	if (evt.key == shortcutRectangle){
		toolSelected = "rectangle"
	}
	if (evt.shiftKey && evt.altKey){
		openDialogue()
	}
})

document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});