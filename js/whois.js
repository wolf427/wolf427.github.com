var relations = new Array();
var result = new Array();
result.push("me");
var level = 0;
var branch = "";
var age = "0";
var currentSex = "0";

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
		//getCurrentResult($(this).val());
		//checkResult(result);
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
Array.prototype.indexOf = function(e){
  for(var i=0,j; j=this[i]; i++){
    if(j==e){return i;}
  }
  return 10000;
}
Array.prototype.lastIndexOf = function(e){
  for(var i=this.length-1,j; j=this[i]; i--){
    if(j==e){return i;}
  }
  return -1;
}
function subCycle(){
	var relations_copy = new Array();
	for (var i=0;i<relations.length;i++) {
		relations_copy.push(relations[i]);
	}
	console.log(relations_copy);
	var i = Math.max(relations_copy.lastIndexOf("son"),relations_copy.lastIndexOf("daughter"));
	var j = Math.min(relations_copy.indexOf("father"),relations_copy.indexOf("mother"));
//	while(i!=-1&&j!=10000&&i<j)
	{
		console.log(i+"  "+j);
		var flag = true;
		for (var k=i;i<j;k++) {
			if (relations_copy[k]=="husband"||relations_copy[k]=="wife") {
				flag=false;
				break;
			}
		}
		if (flag) {
			if (relations_copy[i]=="son"&&relations_copy[i]=="mother") {
				relations_copy.splice(i,j-i+1,"wife");
			} else if (relations_copy[i]=="daughter"&&relations_copy[i]=="father") {
				relations_copy.splice(i,j-i+1,"husband");
			}else{
				relations_copy.splice(i,j-i+1);
			}
		}
		i = Math.max(relations_copy.lastIndexOf("son"),relations_copy.lastIndexOf("daughter"));
		j = Math.min(relations_copy.indexOf("father"),relations_copy.indexOf("mother"));
	}
	return relations_copy;
}


var relations_network;
$.get("resources/relations.json",function(data){
	relations_network = data;
},"json");

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

function checkResult(){
	if(result.length<2)
		return ;
	for(var i=0;i<result.length;i++){
		if(result[i]=="me"){
			$("#final-answer-display").text("这是你么？");
			activeYN(function(){result=["me"];age="0";},function(){result.splice(i,1);});
		}else if(result[i]=="father"){
			$("#final-answer-display").text("这是你爸么？");
			activeYN(function(){result=["father"];age="0";},function(){result.splice(i,1);});
		}else if(result[i]=="mother"){
			$("#final-answer-display").text("这是你妈么？");
			activeYN(function(){result=["mother"];age="0";},function(){result.splice(i,1);});
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
		$("#final-answer-display").text("");
		function_yes();
	});
	$("#btn-no").bind("click",function(){
		
		resetAllButton();
		$("#final-answer-display").text("");
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

var appellations;
$.get("resources/appellation.json",function(data){
	appellations = data;
},"json");

function currentResult(level,branch,result,age){
	
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
			$("#final-answer-display").text("这人比你大么？");
			activeYN(function(){age="big";getFinalResult();},function(){age="little";getFinalResult();});
			return;
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
	console.log("==============");
	console.log(result);
	console.log(finalResult);
	console.log("==============");
	
	
	if(result[0]=="me"||result[0]=="father"||result[0]=="mother"){
		finalResult = result[0];
	}
	var textResult = appellations[finalResult];
	if(textResult==null||textResult==""){
		textResult="未知";
		var image_index;
		var image_path = "";
		if(currentSex=="gay"||currentSex=="lesbian"){
			image_index = Math.floor(Math.random() * ( 0 + 1));
			image_path = "gay"+image_index+".jpg";
		}else{
			image_index = Math.floor(Math.random() * ( 4 + 1));
			image_path = "img"+image_index+".jpg";
		}
		$(".answer-image").attr("src","img/"+image_path);
		return;
	}
	$("#final-answer-display").text(textResult);
		return;
	
}
