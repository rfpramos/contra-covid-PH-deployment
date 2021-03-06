 
 
 google.charts.load('current', {'packages':['corechart']});
 google.charts.setOnLoadCallback(drawChart);
	var options = {series: {
			0: { color: '#0DD3FE', areaOpacity: 1 },
            1: { color: '#C20292' , areaOpacity: 1},
            2: { color: '#F9BD25', areaOpacity: 1 },
            3: { color: '#004B95', areaOpacity: 1 },
			  
			  },
			  title: 'SEIR Model', 
			  hAxis: {title: 'Days Since Outbreak',  titleTextStyle: {color: '#333'},viewWindowMode:'explicit',
				viewWindow: {
				  max:250,
				  min:0 }},

			  vAxis: {
			  gridlines: {
		color: 'transparent'
	  },minValue: 0,viewWindowMode:'explicit',
				viewWindow: {
				  max:num_balls,
				  min:0 }
				  }
			};
	  var chartSim;    
	  
		   function drawChart() {
		  
	   dataC = google.visualization.arrayToDataTable([
			  ['Day since outbreak', 'S', 'I', 'E', 'R'],
			  [,  0,0,0,0]]);
			
			
	   chartSim = new google.visualization.AreaChart(document.getElementById('chartContainerOpenEconomy'));
			chartSim.draw(dataC, options);
			
	}
		 function  updateChart(s,i,e,r) {
		dataC.addRows([
	  [,  s,i,e,r]
	]);
	 chartSim.draw(dataC, options);
	 }


     
      
  // The Simulation class
   var num_balls=80;
     var susceptible = num_balls-1;
	  var infectious = 1;
	  var removed = 0;
	  var exposed = 0;
  class Simulation {
    // Initialize the simulation parameters
    init(opts){
   this.width = opts && opts.width ? opts.width : innerWidth/2;
      this.height = opts && opts.height ? opts.height : innerHeight;
      this.center = [this.width / 2, this.height / 2];
      this.data = [];
      
      return this;
    }
    
    // Add elements (balls) each with a set of properties 
    add(datum){
      const d = datum;
      d.pos = d.pos || [this.width / 2, this.height / 2];
      d.radius = d.radius || 5;
      d.angle = d.angle || 0;
      // d.speed = d.speed;
      d.color = d.color || "#0DD3FE";
      // d.fixed = d.fixed;

      // this is meaningful only for infected individuals (color=#C20292)
      // we have just kept it -1 otherwise
      // d.infected_for = d.infected_for;
      
      this.data.push(d);
      
      return this;
    }
  
    // This is called for each time instant
    // Collisions are detected in this function
    // and parameters of balls are changed accordingly
	//this is the one being called every time, so dito mo ilalagay yung sa graph
    tick(time_instant){
	if (time_instant%8==0)
updateChart(susceptible,infectious,exposed,removed);
	/*
		chart.options.data[0].dataPoints.push({y: susceptible});
	chart.options.data[1].dataPoints.push({y: infectious});
	chart.options.data[2].dataPoints.push({y: exposed});
	chart.options.data[3].dataPoints.push({y: removed});
		chart.render();*/
      // Loop through the data
	  
	document.getElementById("statsOpenEconomy").innerHTML = "<p style=\"color:#0DD3FE;\"> Susceptible: "+ susceptible +"</p><p style=\"color:#F9BD25;\"> Exposed: " + exposed + 
		"<p style=\"color:#C20292;\"> Infectious: " + infectious + "</p> <p style=\"color:#004B95;\">Removed:" + removed +"</p>";
	 
      for (let i = 0; i < this.data.length; i++){
        const d = this.data[i];
		  if(d.color=='#F9BD25')
			{  if(d.infected_for>75){
				exposed--;
				d.color='#C20292';
            d.infected_for=-1;
			infectious++;
			}
			 else{
            d.infected_for+=1;}
		}
        if(d.color=='#C20292'){
          if(d.infected_for>600){ // time to recover | infected_for set determines the time of being infected
          
		infectious--;
			d.color='#004B95';
            d.infected_for=-1;
			removed++;
			
			
		
			
          } else{
            d.infected_for+=1;
          }
		  

		  
        }
        d.collided = false;

        // Detect collisions
        for (let i0 = 0; i0 < this.data.length; i0++){
          const d0 = this.data[i0];
          d0.collided = false;

          // Collision!
          if (i !== i0 && geometric.lineLength([d.pos, d0.pos]) < d.radius + d0.radius && !d.collided && !d0.collided){
            
            // To avoid having them stick to each other,
            // test if moving them in each other's angles will bring them closer or farther apart
            // If one of them is fixed, swap just the angles
            const keep = geometric.lineLength([
                    geometric.pointTranslate(d.pos, d.angle, d.speed),
                    geometric.pointTranslate(d0.pos, d0.angle, d0.speed)
                  ]),
                  swap = (d.fixed||d0.fixed)?geometric.lineLength([
                    geometric.pointTranslate(d.pos, d0.angle, d.speed),
                    geometric.pointTranslate(d0.pos, d.angle, d0.speed)
                  ]):
                  geometric.lineLength([
                    geometric.pointTranslate(d.pos, d0.angle, d0.speed),
                    geometric.pointTranslate(d0.pos, d.angle, d.speed)
                  ]);

            if (keep < swap) {
              const dc = JSON.parse(JSON.stringify(d));
              if(d.fixed){
                d0.angle = dc.angle;
              } else if(d0.fixed){
                d.angle = d0.angle;
              } else{
                d.angle = d0.angle;
                d.speed = d0.speed;
                d0.angle = dc.angle;
                d0.speed = dc.speed;
              }

              // Infection spreads from an infected to a susceptible person
              if(d.color=='#0DD3FE' && d0.color=='#C20292'){//d0 d are the two balls colliding
               //var IorE = Math.random(); 
			   /*
			   if (IorE>=.16)// this probability was derived from the ratio of asymptomatic to symptomatic by 
			   //https://med.stanford.edu/content/dam/sm/id/documents/COVID/AsymptCOVID_TransmissionShip.pdf
			   {d.color = '#C20292';
			   	susceptible--;
			    infectious++;
			   }
			   else */
			   //{
			   d.color = '#F9BD25';
			   	susceptible--;
				exposed++;
				 d.infected_for=0;
			   }
			   
			   //what we will do with here is change it so that another color will represent infectious and exposed(non-infectious)
                 //sets the time d is being infected
		
              //} 
			  else if(d0.color=='#0DD3FE' && d.color=='#C20292'){//states other scenario; this is dicotomous scenario
                 /*var IorE = Math.random(); 
			   if (IorE>=.16)
			   {d0.color = '#C20292';
			    	susceptible--;
					infectious++;
			   }
			   else 
			   {*/d0.color = '#F9BD25';
			   	susceptible--;
					exposed++;
			  // }
                d0.infected_for=0;
					
              } else{}
              
              d.collided = true;
              d0.collided = true;
            }

            break;
          }
        }

        // Detect outer walls
        if (d.pos[0] <= d.radius || d.pos[0] >= this.width - d.radius){

          // Is it moving more towards the middle or away from it?
          const t0 = geometric.pointTranslate(d.pos, d.angle, d.speed);
          const l0 = geometric.lineLength([this.center, t0]);

          const reflected = geometric.angleReflect(d.angle, 90);
          const t1 = geometric.pointTranslate(d.pos, reflected, d.speed);
          const l1 = geometric.lineLength([this.center, t1]);

          if (l1 < l0) d.angle = reflected;
        }

        // Detect vertical walls
        if (d.pos[1] <= d.radius || d.pos[1] >= this.height - d.radius){
          
          // Is it moving more towards the middle or away from it?
          const t0 = geometric.pointTranslate(d.pos, d.angle, d.speed);
          const l0 = geometric.lineLength([this.center, t0]);

          const reflected = geometric.angleReflect(d.angle, 0);
          const t1 = geometric.pointTranslate(d.pos, reflected, d.speed);
          const l1 = geometric.lineLength([this.center, t1]);

          if (l1 < l0) d.angle = reflected;
        }

        d.pos = geometric.pointTranslate(d.pos, d.angle, d.speed);
		
		
		
		
		
		
		
		//console.log("S:" + susceptible+ ", I:" + infectious + ", R: " + removed );
		
		
		
      }
	  
	  
	  
	  
	  
    }
  } 
  // Initiate a simulation
  const mySimulation = (_ => {
    const simulation = new Simulation;
  

    // Initialize this simulation with simulation.init
    // You can pass an optional configuration object to init with the properties:
    //   - width
    //   - height
    simulation.init();

    /*let fixed_balls=Math.round(0.5*num_balls);
    let rand_ind = [];
	//creates non-moving balls
    while(rand_ind.length < fixed_balls){
      let r = Math.floor(Math.random() * num_balls)+1;
      if(rand_ind.indexOf(r) === -1) rand_ind.push(r);
    }*/
    
    // We'll create num_balls circles of random radii, moving in random directions at random speeds.
    for (let i = 0; i < num_balls; i++){
      const radius = 10;
      
      let color_here='#0DD3FE';
      let days_of_infection=-1;
      
      // one infected individual in the beginning
	  
      if(i==0){
        color_here='#C20292';
        days_of_infection=0;
      }
      
      // Add a circle to your simulation with simulation.add
      /*if(rand_ind.includes(i)){ // if the ball is fixed
        simulation.add({
            speed: 0,
            angle: d3.randomUniform(0, 360)(),
            pos: [
            d3.randomUniform(radius, simulation.width - radius)(),
            d3.randomUniform(radius, simulation.height - radius)()
            ],
            color: color_here,
            infected_for: days_of_infection,
            fixed: true,
            radius
        });
      } else{*/
        simulation.add({
               speed: d3.randomUniform(1, 2)(),
            angle: d3.randomUniform(0, 360)(),
            pos: [
            d3.randomUniform(radius, simulation.width - radius)(),
            d3.randomUniform(radius, simulation.height - radius)()
            ],
            color: color_here,
            infected_for: days_of_infection,
            fixed: false,
            radius
        });
      }
    //}
    
    return simulation;
  })();

  // Draw the simulation
  const wrapper = document.getElementById("simulationOpenEconomy");
  const canvas = document.createElement("canvas");
 

  canvas.width = mySimulation.width;
  canvas.height = mySimulation.height;
  canvas.style.background = "#FFFFFF";
  canvas.style.outline = "solid #0DD3FE";
  wrapper.appendChild(canvas);
  const cotx = canvas.getContext("2d");
  cotx.fillStyle = "#0DD3FE";
  cotx.strokeStyle = "#FFFFFF";

  function tick(){
    time_instant+=1;
    requestAnimationFrame(tick);
    cotx.clearRect(0, 0, mySimulation.width, mySimulation.height);

    // The simulation.tick method advances the simulation one tick
    mySimulation.tick(time_instant);
	
    for (let i = 0, l = mySimulation.data.length; i < l; i++){
      const d = mySimulation.data[i];
      cotx.beginPath();
      cotx.arc(...d.pos, d.radius, 0, 2 * Math.PI);
      cotx.fillStyle=d.color;
      cotx.fill();   
      cotx.stroke();
	  
	  
    }
  }

  // Let us keep an incrementing time instant variable
  // for simulation's tick function calls 
  var time_instant=0;
  tick();
