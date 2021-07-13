//global variables for mouseWheel function used by scaling function and to draw on axis
var dateRange = 25;
var yRange1 = 50;
var yRange2 = 200;
var scrollOrZoomOpt = 0;
var datePos = 30;
var drawFeatureOption = '';
var arr = [];
var plotPoint = 0;
var displayData;
var marketData;

//main function run in gallery(sketch file)
function shareTTWO(){
    
    var test36 = 1
    
//    ternary operator in js example 
    test36 < 2 ? console.log("this is true") : console.log('this is false')
    
    // Name for the visualisation to appear in the menu bar.
    this.name = 'Take-Two Interactive Software, Inc. (TTWO)';

    // Each visualisation must have a unique ID with no special
    // characters.
    this.id = 'share-TTWO';
    
    // Property to represent whether data has been loaded.
    this.loaded = false;
    
    // Preload the data. This function is called automatically by the gallery when a visualisation is added.
    this.preload = function() {
        var self = this;
        this.table1 = loadTable(
        './data/Share-TTWO/TTWO.csv', 'csv', 'header',
        // Callback function to set the value this.loaded to true.
            
        function(table) {
            self.loaded = true;
        });
    };
    
    // Setup function for declration of variables
    var graphColor = color(220, 0, 0);
    
    this.setup = function(){
    
//        initialising array for destruction of junk or previous data
        marketData = [];
        
        var menuPos = 250
        
//        creating the menu for graph type selection
        textAlign(CENTER);
        menu1 = createSelect();
        menu1.position(menuPos, 550);
        menu1.option('Candle Chart');
        menu1.option('Line graph');
        menu1.option('Line graph as overlay');
        
//        menu for selecting custom date range
        menu2 = createSelect();
        menu2.position(menuPos + 160, 550);
        menu2.option('Select date range');
        menu2.option('30 days');
        menu2.option('20 days');
        menu2.option('10 days');
        menu2.option('3 days');
        
//        menu for scrolling or zooming
        menu3 = createSelect();
        menu3.position(menuPos + 297, 550);
        menu3.option('Zoom in or out vertically');
        menu3.option('Zoom in or out horizontally');
        menu3.option('Scroll vertically');
        menu3.option('Scroll horizontally');
        
//        menu to enable draw feature
        menu4 = createSelect();
        menu4.position(menuPos + 490, 550);
        menu4.option('Select draw feature');
        menu4.option('Enable Draw Feature');
        menu4.option('Clear Lines');
        
//        to select moving average duration
        menu5 = createSelect();
        menu5.position(menuPos + 650, 550);
        menu5.option('Select moving average duration');
        menu5.option('5');
        menu5.option('10');
        menu5.option('20');
        menu5.option('50');
        menu5.option('100');
        
//      assigning the mouseWheel and mouseClicked function to canvas
        c.mouseWheel(changeScale);
        c.mouseClicked(drawFeature);
        
//      array containing objects
        var t = this.table1;
        var table_rows = t.getRows();
        for (var i = 1; i <  table_rows.length; i++ ){  
//         object for storing data in structured manner and pushed to marketData array
            var data = {
                dateID:t.getString(i,0),
                marketOpen:t.getNum(i,1),
                prevMarketOpen:t.getNum(i - 1,1),
                high:t.getNum(i,2),
                low:t.getNum(i,3),
                marketClose:t.getNum(i,4),
                prevMarketClose:t.getNum(i - 1,4),
                volume:t.getNum(i,6),
                datePos:t.getNum(i,7),
                date:t.getString(i,8)
            }
            marketData.push(data);
            
        }
        
    }
    
//    do destroy the menu after user exits program
    this.destroy = function() {
        menu1.remove()
        menu2.remove()
        menu3.remove()
        menu4.remove()
        menu5.remove()
        
    }
        
    // Main draw function starts here
    this.draw = function() {
        
//        console.log(mouseX,mouseY)
        
        if (!this.loaded) {
            console.log('Data not yet loaded');
            return;
        }
        
//      call custom date function
        if (menu3.value() !== 'Zoom in or out horizontally' && menu2.value() != 'Select date range'){
            dateRange = dateRangeSelect(menu2.value())
        }
        
//      call scroll or zoom function
        scrollOrZoom(menu3.value())
        
//        clearing the displayData array for it to have only 1 or 2 values at all times.
        displayData = [];
        
        for (var i = 1; i <= marketData.length - 1 ;i++){
            
            drawGrid(datePos + (marketData[i].datePos * dateRange))
            
            featureSelect(menu1.value(),
                      marketData[i].marketOpen,
                      marketData[i].marketClose,
                      datePos + (marketData[i].datePos * dateRange),
                      marketData[i].high,
                      marketData[i].low,
                      marketData[i].prevMarketClose,
                      datePos + (marketData[i - 1].datePos * dateRange))
            
//          x axis plot points
            fill(0)
            
            textSize(15)
//            condition to remove numbers if dateRange is too small
            if (dateRange <= 20){
                if(marketData[i].dateID.length >= 3){
                     text(marketData[i].dateID,datePos + (marketData[i].datePos * dateRange),520);
                }
            } else {
                 text(marketData[i].dateID,datePos + (marketData[i].datePos * dateRange),520);
            }
            
            var p = searchVal(datePos + (marketData[i].datePos * dateRange),
                          mouseX,
                          marketData[i].marketClose)
            
//            to prevent invalid responses if mouseX is not within the range of a candle
            if(p != undefined){
                var temp = p
                plotPoint = map(p,yRange2,yRange1,20,500,true)
                var temp3 = {
                    priceDate:marketData[i].date,
                    mktClose:marketData[i].marketClose,
                    mktOpen:marketData[i].marketOpen,
                    mktHigh:marketData[i].high,
                    mktLow:marketData[i].low,
                    mktVol:marketData[i].volume,
                    mktChange:(marketData[i].marketClose - marketData[i].marketOpen)/marketData[i].marketOpen
                }
                displayData.push(temp3)
            }
            
            if (menu5.value() !== 'Select moving average duration'){
                drawMovingAverage(menu5.value(),
                              marketData[i].datePos,
                              datePos + (marketData[i].datePos * dateRange),
                              datePos + (marketData[i - 1].datePos * dateRange))
            }
        }
         
 //        drawing both axises
        drawBothAxis() 
        
//        drawFeature being called and the points clicked by the user pushed to global array called arr
        drawFeatureOption = menu4.value()
        if (drawFeatureOption == 'Clear Lines'){
            arr = []
        }
        fill(0)
        
        displayDataFunc(displayData)
        
//        drawing the pointer that follows the mouse
        strokeWeight(0.5)
        fill(0)
        text('$' + round(temp),20,plotPoint)
//        horizontal line
        line(40,plotPoint,1100,plotPoint)
//        vertical line
        line(mouseX,20,mouseX,500)
        strokeWeight(1)
        
//        This is for drawing the lines when the drawFeature function is active.
        drawFeatureImplement(arr)
        
    }
}

function displayDataFunc(displayData){
//        to display information on the share selected on the bottom right
//        displayData array will always have 1 or 2 elements, not more than that. 
        if (displayData[0] != undefined){
            textAlign(LEFT)
            text("TTWO on " + displayData[0].priceDate,780,580)
            text("Open        $" + displayData[0].mktOpen,780,595)
            text("High         $" + displayData[0].mktHigh,780,610)
            text("Low          $" + displayData[0].mktLow,780,625)
            text("Close        $" + displayData[0].mktClose,780,640)
            text("Volume     " + displayData[0].mktVol,780,655)
            text("% Change " + (displayData[0].mktChange * 100) + "%",780,670)
            textAlign(CENTER)
        }else{
            textAlign(LEFT)
            text("TTWO         -",780,580)
            text("Open        $ -",780,595)
            text("High         $ -",780,610)
            text("Low          $ -",780,625)
            text("Close        $ -",780,640)
            text("Volume     -",780,655)
            text("% Change -%",780,670)
            textAlign(CENTER)
        }
}

//function to search if the mouseX is within the range of a candle
function searchVal(arrayVal,searchItem,returnVal){
    if (searchItem <= (arrayVal + dateRange/2) && searchItem >= (arrayVal - dateRange/2)){
        return returnVal;
    }
}

//function to enable draw features. this function is connected to the mouseclicked event and 
// menu4.value selection. max number of lines allowed is 3.
function drawFeature(){
    if (drawFeatureOption == 'Enable Draw Feature' && arr.length <= 5 && mouseX >= 40){
        var pos = {xPos : mouseX, yPos : plotPoint, compareData : displayData}
        arr.push(pos)
    } else{
        console.log('arr full',arr.length)
    }
}

//this is the function to draw the lines and share statistics for the draw feature based on the
//array produced by the previous function.
function drawFeatureImplement(arr){
    for (var i = 1; i <= arr.length; i++){
            if (i % 2 == 0 && arr.length != 0){
                strokeWeight(2.5)
                line(arr[i - 2].xPos,arr[i - 2].yPos,arr[i - 1].xPos,arr[i - 1].yPos)
                strokeWeight(1)

                textAlign(LEFT)
                text("Dates - " + arr[i-2].compareData[0].priceDate + ' ' + arr[i-1].compareData[0].priceDate,-200 + (i*100),580)
                textAlign(CENTER)
            } 
        }
}

//function to draw horizontal and vertical gridlines according to datePos
function drawGrid(xPos){
    
//  horizontal grid lines
    stroke(200)
    strokeWeight(0.25)
    line(20,20,1100,20)
    line(20,140,1100,140)
    line(20,260,1100,260)
    line(20,380,1100,380)
//  vertical grid lines
    line(xPos,500,xPos,20)
    strokeWeight(1)
    stroke(0)
}

//function for drawing both axis, plot points and grid
function drawBothAxis(){
    
//  plot y axis
//  opague white rectangle to hide everything to the left of the axis line
    fill(255)
    noStroke()
    rect(40,20,-40,510)
    stroke(0)
    strokeWeight(3)
    line(40,20,40,500)
    strokeWeight(1)
    
//  y axis plot points
    fill(0)
    textSize(15)
    text('$' + yRange2,20,20)
    text('$' + (((yRange2 - yRange1) * 3/4) + yRange1),20,140)
    text('$' + ((yRange2 + yRange1) /2),20,260)
    text('$' + (((yRange2 - yRange1) * 1/4) + yRange1),20,380)
    text('$' + yRange1,20,500)

//  plot x axis
    stroke(0)
    strokeWeight(3)
    line(40,500,1100,500)
    strokeWeight(1)
    noFill()
}

//function for scroll or zoom from menu selection
function scrollOrZoom(option){
    if (option == 'Zoom in or out vertically'){
    scrollOrZoomOpt = 1
}
    else if (option == 'Scroll vertically'){
        scrollOrZoomOpt = 2
    }
        else if (option == 'Scroll horizontally'){
            scrollOrZoomOpt = 3
        }   
            else if (option == 'Zoom in or out horizontally'){
                scrollOrZoomOpt = 4
            }       
}

//function for custom date range 
function dateRangeSelect(option){
if (option == '30 days'){
    return 30
}
    else if (option == '20 days'){
        return 48
    }
        else if (option == '10 days'){
            return 95
        }
            else if (option == '3 days'){
                return 250
            }
}

//this  function is called when the mouseWheel event is triggered
function changeScale(event){
    arr = []
    if (scrollOrZoomOpt == 1){
//    option == 'Zoom in or out vertically'
        if (event.deltaY > 0) {
            yRange1 -= 5
            yRange2 += 5

        } else {
            yRange1 += 5
            yRange2 -= 5
          
            yRange1 = min(yRange1,120);
            yRange2 = max(yRange2,130);
        }
        
    } else if(scrollOrZoomOpt == 2){
//        option == 'Scroll vertically'
        var temp1 = yRange1
        var temp2 = yRange2
        
        if (event.deltaY > 0) {
            yRange1 -= ((temp2 - temp1) / 20)
            yRange2 -= ((temp2 - temp1) / 20)
            
            } else {
                yRange1 += ((temp2 - temp1) / 20)
                yRange2 += ((temp2 - temp1) / 20)
            }
        } else if(scrollOrZoomOpt == 3){
//            option == 'Scroll horizontally'
            if (event.deltaY > 0) {
                datePos += 20
            } else{
                datePos -= 20
            }
        } else if(scrollOrZoomOpt == 4){
//            option == 'Zoom in or out horizontally'
            if (event.deltaY > 0) {
                dateRange -= 2
            } else{
                dateRange += 2
            }
        }
}   
    
//the inputs for these functions cannot be changed to just the marketData array as it can only feed in the specific record per function call
function featureSelect(option,marketOpen,marketClose,date,high,low,prevMarketClose,prevDate){
    
    if (option == 'Candle Chart'){
        drawCandle(marketOpen,marketClose,date,high,low)
    } else if (option == 'Line graph'){
        drawLineGraph(marketClose,date,prevMarketClose,prevDate)
    } else if (option == 'Line graph as overlay'){
        drawLineGraph(marketClose,date,prevMarketClose,prevDate)
        drawCandle(marketOpen,marketClose,date,high,low)
    }
}

//simmple function to draw line graph when enabled.
function drawLineGraph(marketClose,date,prevMarketClose,prevDate){
    line(prevDate,map(prevMarketClose,yRange2,yRange1,20,500,true),date,map(marketClose,yRange2,yRange1,20,500,true))
}

//main function to draw each candle.
function drawCandle(marketOpen,marketClose,date,high,low){ 
//    candle structure calculations
//    making the wick for the candle
    line(date,map(high,yRange2,yRange1,20,500,true),date,map(low,yRange2,yRange1,20,500,true))
    
//    making the body of the candle
//    marking the candles as red or green according to the values in the csv
    if (marketClose > marketOpen){
        graphColor = color(0, 220, 0);
        fill(graphColor)
        rect(date - 2.5,
             map(marketClose,yRange2,yRange1,20,500,true),
             5,
             map(marketOpen,yRange2,yRange1,20,500,true) - map(marketClose,yRange2,yRange1,20,500,true))
    } else {
        graphColor = color(220, 0, 0);
        fill(graphColor)
        rect(date - 2.5,
            map(marketOpen,yRange2,yRange1,20,500,true),
            5,
            map(marketClose,yRange2,yRange1,20,500,true) - map(marketOpen,yRange2,yRange1,20,500,true))
    }
    noFill()
}

//function to draw blue line using moving average formulae.
function drawMovingAverage(days,datePos,date,prevDate){
    var prevAverage = 0
    var currentAverage = 0
    
//    calculates average of e.g. 20 days(variable) before current candle
    if (datePos > days){
        for (var i = datePos - days; i < datePos; i++){
            prevAverage += marketData[i].prevMarketClose
            currentAverage += marketData[i].marketClose
        }
        prevAverage = prevAverage/days
        currentAverage = currentAverage/days
    }
    
//    draw both points as a line
    if (prevAverage !== 0){
        stroke(0,0,200)
        line(prevDate,
             map(prevAverage,yRange2,yRange1,20,500,true),
             date,
             map(currentAverage,yRange2,yRange1,20,500,true))
        stroke(0)
    }
}