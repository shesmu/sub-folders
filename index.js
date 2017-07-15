$(document).ready(function(){
	/*
		TODO 
		folder options
		take over global subscriber options
	*/
	$("#guide-subscriptions-section > span.guide-sort-container.yt-uix-button-group").remove();
	//make sure the folders are loaded onto the side bar
	function side_watcher(){
		var side_watcher = setInterval(function(){
			if(!$("#tube-sub-plus").length){
				if($("#guide-channels").length){
					$("#guide-subscriptions-section > h3").after("<span class='yt-sprite' id='tube-sub-plus'>");
					if (localStorage.getItem('folder_structure') != null){
						var folder_structure = JSON.parse(localStorage.getItem('folder_structure'));
						for(i in folder_structure){
							var this_folder = folder_structure[i].folder_name
							$("#guide-channels").prepend(gen_folder_html(this_folder));
						}
						allocate_contents(folder_structure);
					}	
				}
			}
			else{
				clearInterval(side_watcher);
			}
		},300);
	}

	//update the folder structure in local storage
	function update_state(obj){
		localStorage.setItem('folder_structure', JSON.stringify(obj));
	}

	//move and store elements of folder contents
	function allocate_contents(obj){
		for (i in obj){
			for (x in obj[i].contents){
				$("#" + obj[i].contents[x]).appendTo("#tube-sub-" + obj[i].folder_name + "-contents");
			}
		}
	}

	//delete folder
	function delete_folder(obj, name){
		for (i in obj){
			if(obj[i].folder_name == name){
				folder_structure.splice(i, 1);
				update_state(folder_structure);
				break;
			}
		}
	}

	//generate the folders and required elements
	function gen_folder_html(name){
		var packet = 	`<div class='folder-wrapper'>
							<p class='tube-sub-folder' id='tube-sub` + name + `'>` + name + `</p>
							<span class="yt-uix-button-icon tube-sub-folder-options yt-sprite"></span>
							<div class='tube-sub-folder-options-container'>
							</div>
							<div style='display:none;' class='tube-sub-content' id='tube-sub-` + name + `-contents'>
							</div>
						<div>`;

		return packet;
	}

	function check_duplicates(name){
		for(i in folder_structure){
			if(folder_structure[i].folder_name == name){
				return true;
				break;
			}
		}
		return false;
	}

	function options_packet(){
		var packet =	`<ul class="tube-options-container yt-uix-button-menu yt-uix-button-menu-hover-action-menu" id="tube-options-container" role="menu" aria-haspopup="true" style="min-width: 11px; right:7px;">
							<li role="menuitem"><span class="yt-uix-button-menu-item" checked="False" tube-sub-sort="1" id="tube-sub-activity">New activity</span></li>
							<li role="menuitem"><span class="yt-uix-button-menu-item" checked="False" tube-sub-sort="2" id="tube-sub-a-z">A-Z</span></li>
							<li role="menuitem"><span class="yt-uix-button-menu-item" checked="False" tube-sub-sort="3" id="tube-sub-delete">Delete</span></li>
						</ul>`;
		return packet;
	}

	side_watcher();

	$("#appbar-guide-button").click(function(){
		side_watcher();
	});


	//handle options menu opening
	$("body").on("click", ".tube-sub-folder-options", function(){
		if(!$("#tube-options-container").length){
			$(options_packet()).insertAfter($(this).parent().children("p"));
		}
		else{
			$("#tube-options-container").remove();
		}
	});

	$(document).click(function(event){
		if(!$(event.target).is('.tube-sub-folder-options') && !$(event.target).parents("#tube-options-container").is("#tube-options-container")){
		    $("#tube-options-container").remove();
		}
	})

	//handle folder options
	//most relevant
	$("body").on("click", "#tube-sub-most-relevant", function(){

	})

	//newest activity
	$("body").on("click", "#tube-sub-activity", function(){
		
		var mylist = $(this).parent().parent().parent().children(".tube-sub-content"),
			listitems = mylist.children('li').get(),
			this_folder_name = $(this).parent().parent().parent().children("p").text();

		listitems.sort(function(a, b){
		   return +parseInt($(a).find(".guide-count-value").text()) - +parseInt($(b).find(".guide-count-value").text());
		})

		var contents = [];

		$.each(listitems, function(idx, itm){ 
			mylist.append(itm);
			contents.push($(itm).attr("id"));	 
		});

		$(this).parent().parent().remove();

		for(i in folder_structure){
			if(folder_structure[i].folder_name == this_folder_name){
				folder_structure[i].contents = contents;
			}
		}
		update_state(folder_structure);
	})

	//alphebetical order
	$("body").on("click", "#tube-sub-a-z", function(){
		var mylist = $(this).parent().parent().parent().children(".tube-sub-content"),
			listitems = mylist.children('li').get(),
			this_folder_name = $(this).parent().parent().parent().children("p").text();

		listitems.sort(function(a, b){
			var first = $(a).parent().parent().parent().find(".display-name").children("span").html().trim().toUpperCase(),
				second = $(b).parent().parent().parent().find(".display-name").children("span").html().trim().toUpperCase();

		   return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
		})

		var contents = [];

		$.each(listitems, function(idx, itm){ 
			mylist.append(itm);
			contents.push($(itm).attr("id"));	 
		});

		$(this).parent().parent().remove();

		for(i in folder_structure){
			if(folder_structure[i].folder_name == this_folder_name){
				folder_structure[i].contents = contents;
			}
		}
		update_state(folder_structure);
	})

	//delete folder
	$("body").on("click", "#tube-sub-delete", function(){
		var folder_name = $(this).parent().parent().siblings("p").text();
		delete_folder(folder_structure, folder_name);
		$(this).parent().parent().parent("div").remove();
	})

	//put the plus button in the subs sidebar
	$("#guide-subscriptions-section > h3").after("<span class='yt-sprite' id='tube-sub-plus'>");

	//render folders on to page if there are any
	if (localStorage.getItem('folder_structure') != null){
		var folder_structure = JSON.parse(localStorage.getItem('folder_structure'));
		for(i in folder_structure){
			var this_folder = folder_structure[i].folder_name
			$("#guide-channels").prepend(gen_folder_html(this_folder));
		}
		allocate_contents(folder_structure);
	}
	else{
		var folder_structure = [];
	}

	//instatntiate draggable and droppables
	$(".guide-channel").draggable({
		revert : function(event, ui) {
            $(this).data("uiDraggable").originalPosition = {
                top : 0,
                left : 0,
            };

            return !event;
        }
	});

	$(".tube-sub-folder").droppable({
		drop : function(event, ui){
			var this_sub = $(ui.draggable).attr("id"),
				this_folder = $(this).text();
			for(i in folder_structure){
				if(folder_structure[i].folder_name == this_folder){
					folder_structure[i].contents.push(this_sub);
					$(ui.draggable).appendTo("#tube-sub-" + this_folder + "-contents");
					$(ui.draggable).css({"left": 0, "top": 0});
					update_state(folder_structure);
				}
			}
		}
	});

	$(".folder-wrapper").droppable({
		drop : function(event, ui){
			var this_sub = $(ui.draggable).attr("id"),
				this_folder = $(this).children("p").text();
			for(i in folder_structure){
				if(folder_structure[i].folder_name == this_folder){
					folder_structure[i].contents.push(this_sub);
					$(ui.draggable).appendTo("#tube-sub-" + this_folder + "-contents");
					$(ui.draggable).css({"left": 0, "top": 0});
					update_state(folder_structure);
				}
			}
		}
	});

	//generate the folder name input box on click
	$("body").on("click", "#tube-sub-plus", function(){
		if(!$("#tube-sub-input").length){
			$(this).after("<input type='text' id='tube-sub-input'>");
		}
	})

	//bind enter to create a new folder
	$("body").on("keypress", "#tube-sub-input", function(e){
		if (e.which == 13){
			if($(this).val() == ""){
				$(this).remove();
			}
			//dis-allow duplicate folder names
			else if(check_duplicates($(this).val()) || check_duplicates($(this).val().split(' ').join("-"))){
				$(this).css({"border" : "1px red solid"});
			}
			else{
				$("#guide-channels").prepend(gen_folder_html($(this).val().split(' ').join("-")));
				$(".tube-sub-folder").droppable({
					drop : function(event, ui){
						var this_sub = $(ui.draggable).attr("id"),
							this_folder = $(this).text();
						for(i in folder_structure){
							if(folder_structure[i].folder_name == this_folder){
								folder_structure[i].contents.push(this_sub);
								$(ui.draggable).appendTo("#tube-sub-" + this_folder + "-contents");
								$(ui.draggable).css({"left": 0, "top": 0});
								update_state(folder_structure);
							}
						}
					}
				});
				
				$(this).remove();
				folder_structure.push({folder_name: $(this).val().split(' ').join("-"), contents : []});	
				update_state(folder_structure);
			}
		}
	})

	//toggle the folder contents
	$("body").on("click", ".tube-sub-folder", function(){
		var folder_name = $(this).text();
		$("#tube-sub-" + folder_name + "-contents").toggle("slow");
		$(this).animate({
        	scrollTop: $("#tube-sub-" + folder_name + "-contents").offset().top
    	}, 2000)
	})

})
