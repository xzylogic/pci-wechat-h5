
  var nameEl = document.getElementById('showPicker');
  var namelecture = document.getElementById('showPickerlecture');
  var sex = document.getElementById('sex');
  var lectureInput = document.getElementById('lecture');
  var lecture = [];
  var json = JSON.parse(jsondata);
  for (var i = 0; i < json.length; i++) {
    json[i].text = json[i].name;
    json[i].value = json[i].id;
    lecture.push(json[i]);
  };
  var data = [{
    text: '男',
    value: 1
  }, {
    text: '女',
    value: 2
  }];

 var lecture = new Picker({
    data:[lecture],
    selectedIndex:[0],
    title:'您的选择'
 });

  var picker = new Picker({
    data: [data],
    selectedIndex: [0],
    title: '您的选择'
  });

  picker.on('picker.select', function(selectedVal, selectedIndex) {
    nameEl.innerText = data[selectedIndex[0]].text;
    sex.value = data[selectedIndex[0]].text;
  });

  lecture.on('picker.select', function(selectedVal, selectedIndex) {
    namelecture.innerText = lecture.data[0][selectedIndex[0]].text;
    lectureInput.value = selectedIndex[0]+1;
  });

  nameEl.addEventListener('click', function() {
    picker.show();
  });

  namelecture.addEventListener('click', function() {
    lecture.show(function(){
      picker.refill(lecture);
    });
  });


  /*方法调用*/
  inputFn(".name");
  inputFn(".age");

	 function inputFn(ele) {
      $(ele).bind('keyup blur',function(){
          var val = $(this).val();
          if(val == ""){
             $(this).next('p').html("请将信息添加完全");
             $(this).siblings('label').children().css({'color':'red'});
             $("button").removeClass("submit");
           }else{
              $(this).next('p').html("");
              $(this).siblings('label').children().css({'color':'#000'});    
           };
          if($(".name").val() && $(".age").val()){
              $("button").addClass("submit");
            };
          var age = $(".age").val();
          if(age.length > 2 || (/[^0-9]+/g).test(age)){
            $(".age").next('p').html("请填写正确的年龄");
            $("button").removeClass("submit"); 
          }
      });
        if($(".name").val() && $(".age").val()){
            $("button").addClass("submit");
          } 
  };
  //提交表单
  $("#button").click(function(){
    if($(".name").val() && $(".age").val() && $(".age").val().length <= 2 && !(/[^0-9]+/g).test($(".age").val())){
         var name = $(".name").val();
         var age = $(".age").val();
         var sex = $("#sex").val();
         var lectureId = $("#lecture").val();
         $.ajax({
          url:window.location.pathname+"/verify",
          data:{name:name, age:age, sex:sex, lectureId:lectureId},
          type:'get',
          success:function(data){
            if(data.code == 0){
              location.href = "success?img="+data._data;
            }else if(data.code == 1){
              $(".space").html(data.err);
            }
          }
         })
    }
  });
  //底部提交按钮顶上去
  var oHeight = $(document).height(); //浏览器当前的高度

   $(window).resize(function(){
 
        if($(document).height() < oHeight){
         
        $("#button").css("display","none");
    }else{
         
        $("#button").css("display","block");
    }
        
   });
