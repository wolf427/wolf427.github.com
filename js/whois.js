var relations = new Array();
var result = new Array();
result.push("me");
var level = 0;
var branch = "";
var age = "0";
var currentSex = "0";

var relations_network;
$.get("resources/relations.json",function(data){
	relations_network = data;
},"json");

var appellations;
function initAppellations(address){
	$.get("resources/dialect_appellation.json",function(data){
		var entry = data[address];
		var appellation_url = "resources/dialect/";
		if(entry == null){
			entry = data["default"];
		}
		appellation_url += (entry["appellation_file"]+".json");
		$.get(appellation_url,function(data){
			appellations = data;
		},"json");
		$("head title").append(entry["address_name"]);
		$("#current-dialect").text(entry["address_name"]);
	},"json");
}

function resetParameters(){
	level = 0;
	branch = "";
	age = "0";
	result = new Array();
	result.push("me");
	$("#final-answer-display").html("<img class='answer-image'/>");
	currentSex = "0";
}

function bindClick(){
	$("button[name='btn-relation']").click(function(){
		var relationship_input = $("#relationship-input").text();
		var relationText = "";
		switch($(this).val()){
			case "father":{
				relationText = "爸爸";
				break;
			}
			case "mother":{
				relationText = "妈妈";
				break;
			}
			case "bbrother":{
				relationText = "哥哥";
				break;
			}
			case "lsister":{
				relationText = "妹妹";
				break;
			}
			case "bsister":{
				relationText = "姐姐";
				break;
			}
			case "lbrother":{
				relationText = "弟弟";
				break;
			}
			case "husband":{
				relationText = "丈夫";
				break;
			}
			case "wife":{
				relationText = "妻子";
				break;
			}
			case "daughter":{
				relationText = "女儿";
				break;
			}
			case "son":{
				relationText = "儿子";
				break;
			}
			
		}
		relations.push($(this).val());
		if (relationship_input!=null && relationship_input!="") {
			relationship_input += "的"+relationText;
		} else{
			relationship_input += relationText;
		}
		$("#relationship-input").text(relationship_input);
	});
	$("#btn-reset").click(function(){
		$("#relationship-input").text("我");
		relations = new Array();
		resetParameters();
		resetAllButton();
	});
	
	$("#btn-backspace").click(function(){
		var relation_input = $("#relationship-input").text();
		var last_split_index = relation_input.lastIndexOf("的");
		if(last_split_index>0){
			relation_input = relation_input.substring(0,relation_input.lastIndexOf("的"));
		}
		else{
			relation_input = "我";
		}
		$("#relationship-input").text(relation_input);
		relations.pop();
	});
}




function getResult(){
	
	resetParameters();
	
	for (var i=0;i<relations.length;i++) {
		calculateCurrent(relations[i]);
	}
		
	getFinalResult();
}

function calculateCurrent(next_relation){
	switch(next_relation){
			case "father":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_father");
				age = ageReset(age);
				level++;
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "f";
				break;
			}
			case "mother":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_mother");
				age = ageReset(age);
				level++;
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "m";
				break;
			}
			case "bbrother":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_big_brother");
				age = ageBigger(age);
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "f";
				break;
			}
			case "lsister":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_big_sister");
				age = ageLittle(age);
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "m";
				break;
			}
			case "bsister":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_big_sister");
				age = ageBigger(age);
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "m";
				break;
			}
			case "lbrother":{
				branch = addBranch(result,branch);
				result = queryRelations(result,"r_little_brother");
				age = ageLittle(age);
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "f";
				break;
			}
			case "husband":{
				branch = toggleBranch(result,branch);
				result = queryRelations(result,"r_husband");
//				age = ageReset(age);
				if (currentSex == "f") {
					currentSex = "gay";
				} else{
					currentSex = "f";
				}
				break;
			}
			case "wife":{
				branch = toggleBranch(result,branch);
				result = queryRelations(result,"r_wife");
//				age = ageReset(age);
				if (currentSex == "m") {
					currentSex = "lesbian";
				} else{
					currentSex = "f";
				}
				break;
			}
			case "daughter":{
				branch = removeBranch(result,branch);
				result = queryRelations(result,"r_daughter");
				age = "unknown";
				level--;
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "m";
				break;
			}
			case "son":{
				branch = removeBranch(result,branch);
				result = queryRelations(result,"r_son");
				age = "unknown";
				level--;
				if(currentSex!="gay"&&currentSex!="lesbian")
					currentSex = "f";
				break;
			}
		}
}


function activeYN(function_yes,function_no){
	$("button[name='btn-relation']").each(function(){
		$(this).attr("disabled","disabled");
	});
	$("button[name='btn-whether-or-not']").each(function(){
		$(this).removeAttr("disabled");
	});
	$("#calculate_result").attr("disabled","disabled");
	$("#btn-yes").bind("click",function(){
		resetAllButton();
		$("#final-answer-display").html("<img class='answer-image'/>");
		function_yes();
	});
	$("#btn-no").bind("click",function(){
		resetAllButton();
		$("#final-answer-display").html("<img class='answer-image'/>");
		function_no();
	});
}

function resetAllButton(){
	$("button[name='btn-relation']").each(function(){
		$(this).removeAttr("disabled");
	});
	$("button[name='btn-whether-or-not']").each(function(){
		$(this).attr("disabled","disabled");
	});
	$("#calculate_result").removeAttr("disabled");
}

function ageBigger(age){
	var age_result = age;
	if(age=="little"){
		age_result = "unknown";
	}else if(age == "0"){
		age_result = "big";
	}
	return age_result;
}
function ageLittle(age){
	var age_result = age;
	if(age=="big"){
		age_result = "unknown";
	}else if(age == "0"){
		age_result = "little";
	}
	return age_result;
}
function ageReset(age){
	return "0";
}

function queryRelations(result,relation){
	var innerResult = new Array();
	for (var i=0;i<result.length;i++) {
		if(relations_network[result[i]]==null){
			innerResult.push(result[i]+"_"+relation.substr(2));
			continue;
		}
		var next_relations = relations_network[result[i]][relation];
		if(next_relations instanceof Array){
			innerResult.push.apply(innerResult,relations_network[result[i]][relation]);
		}else{
			innerResult.push(relations_network[result[i]][relation]);
		}
	}
	//your father's sister's son is your "biaoge".
	if(result[0]=="aunt"&&(relation=="r_daughter"||relation=="r_son")){branch="m";}
	
	return innerResult;
}

function addBranch(result,branch){
	if (result.length==1&&result[0]=="father") {
		branch = "f";
	}else if (result.length==1&&result[0]=="mother") {
		branch = "m";
	}
	return branch;
}
function toggleBranch(result,branch){
	if (result.length==1&&result[0]=="father") {
		branch = "m";
	}else if (result.length==1&&result[0]=="mother") {
		branch = "f";
	}
	return branch;
}
function removeBranch(result,branch){
	if (result.length==1&&result[0]=="father") {
		branch = "";
	}else if (result.length==1&&result[0]=="mother") {
		branch = "";
	}
	return branch;
}

function getFinalResult(){
	if (level>4) {
		$("#final-answer-display").text("祖宗");
		return;
	}else if(level<-3){
		$("#final-answer-display").text("小祖宗");
		return;
	}
	
	if (age=="unknown") {
		if(level==0){
			if(result[0]=="brother"||result[0]=="sister"||result[0]=="cousin_brother"||result[0]=="cousin_sister"){
				$("#final-answer-display").text("这人比你大么？");
				activeYN(function(){age="big";getFinalResult();},function(){age="little";getFinalResult();});
				return;
			}else{
				age="0";
			}
		}else if(level==1){
			if (branch=="f"&&result[0]=="uncle") {
				$("#final-answer-display").text("这人比你爸大么？");
				activeYN(function(){age="big";getFinalResult();},function(){age="little";getFinalResult();});
				return;
			} else{
				age="big";
			}
		}else if (level<0){
			age = "0";
		}else{
			age = "0";
		}
	}

	var finalResult = "";
	if(age!="0"){
		finalResult += (age+"_");
	}
	finalResult += result[0];
	if(branch!=""){
		finalResult += ("_"+branch);
	}
	
	if(result[0]=="me"||result[0]=="father"||result[0]=="mother"){
		finalResult = result[0];
	}
	var textResult = appellations[finalResult];
	console.log(finalResult);
	if(textResult==null||textResult==""){
		
		textResult="未知";
		var image_index;
		var image_path = "";
		if(currentSex=="gay"||currentSex=="lesbian"){
			image_index = Math.floor(Math.random() * ( 0 + 1));
			image_path = "gay"+image_index+".jpg";
		}else{
			
			image_index = Math.floor(Math.random() * ( 10 + 1));
			image_path = "img"+image_index+".jpg";
		}
		$(".answer-image").attr("src","img/"+image_path);
		return;
	}
	$("#final-answer-display").text(textResult);
	return;
	
}
