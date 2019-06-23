$(document).ready(function(){
    // let $users = $('#users');
    let a =1, d = 1;
    let bucket;
    let $questions = $('#questions');       //from view
    let $eye = $('.eye');
    // let $viewone = $('#viewone')
    let $test = $('#test');             //from taketest
    let $ques = $('#ques'),         //from create
        $addQues = $('#addQues'),
        $option1 = $('#option1'),
        $option2 = $('#option2'),
        $correctAns = $('#correctAns'),
        num = 1,
        n = 1;
        // alph = 'a';
    let url = 'http://localhost:5000/';
    //GetALL
    $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){            
           $.each(data, function(i, q){
            $questions.append(`
              <br> <li> ${num}.  ${q.question} <i data-id = ${q.id} class="edit fas fa-edit"></i> <i data-id = ${q.id} class="remove fas fa-trash-alt"></i></li><br>
            `)
            num++;
           })
        // console.log(data);
        
        }
    });

    //Get One
    $questions.delegate('.eye', 'click', function(){
        $.ajax({
            type: 'GET',
            url: url+'quiz/'+ $(this).attr('data-id'),
            success: function(data){            
               
                $test.append(`
                  <br> <li> id: ${data.id}.  ${data.question}  <i data-id = ${data.id} class="remove fas fa-trash-alt"></i></li><br>
                  <li>${data.option1}</li>
                  <li>${data.option2}</li>
                  <li>${data.correct_answer}</li>
                `)
                window.location.href = 'http://localhost:5000/taketest.html';
            
            }
        });
    })

    //post
    $addQues.on('click', function(e){
        e.preventDefault();
        let question = {
            question: $ques.val(),
            option1: $option1.val(),
            option2: $option2.val(),
            correct_answer: $correctAns.val()
        }

        
        $.ajax({
            type: 'POST',
            url: `${url}quiz`,
            data: question,
            success: function(){
                
                window.location.href = 'http://localhost:5000/allques.html';
            },
            error: function(){
                alert('error adding question')
            }
        });
    })    

    //delete
    $questions.delegate('.remove', 'click', function(){
        let $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: url+'quiz/' + $(this).attr('data-id'),
            success: function(){
                $li.fadeOut(300, function(){
                    $(this).remove();
                });
            }
        })
    })

    //put req
    $questions.on('click', function(e){
        // window.location.href = 'http://localhost:5000/allques.html';
        e.preventDefault();
        let question = {
            question: $ques.val(),
            option1: $option1.val(),
            option2: $option2.val(),
            correct_answer: $correctAns.val()
        }

        
        $.ajax({
            type: 'PUT',
            url: `${url}quiz/${id}`,
            data: question,
            success: function(newQues){
                
                 window.location.href = 'http://localhost:5000/allques.html';
            },
            error: function(){
                alert('error editing question')
            }
        });
    })  


    //answering the test
    
    
     $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){  
            
           $.each(data, function(i, newQues){

            let $li0 = `<input class="option" type="radio" name="q${d}" value="${newQues.option1}"> ${newQues.option1}`;
            let $li1 = `<input class="option" type="radio" name="q${d}" value="${newQues.option2}"> ${newQues.option2}`;
            let $li2 = `<input class="option" type="radio" name="q${d}" value="${newQues.correct_answer}"> ${newQues.correct_answer}`;
            bucket = [$li0, $li1];
            bucket.splice(Math.floor(Math.random() * 2), 0, $li2);
            
            $test.append(`        
                   <br><p class ="questions"> ${n}. ${newQues.question} </p><br>
                 `)
                 
                 $.each(bucket, function(i, q){
                     $test.append(`${q}<br>`)
                     
                 });          
                     
            n++;
            a++;           
            d++;
           })       
        //    $(li).on('click', function() {
        //     $('li').addClass('active');
            
        //   })
        }
    }); 
    
    //processing user values with correct values    
    let correctVal = [];
    let userVal = [];
    //get corect answers
    $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){            
           $.each(data, function(i, q){
              correctVal.push(q.correct_answer)
           })
        //    console.log(correctVal)
        }
    });
    $('#submit').on('click', function(){
        
        for (let i = 1; i <= correctVal.length; i++) {
            userVal.push($(`input[name=q${i}]:checked`).val());
        }
        let result = processResults(userVal, correctVal);
        if(result >= 7){
            $('#showresult').html(`<br> <h3 class="option">Great job! Your Score: ${result}</h3>
            <h3>   <a href="taketest.html">Take Quiz</a> <i class="fas fa-redo-alt"></i></h3>
        `);
        }else{
            $('#showresult').html(`<h3 class="option"> Keep Working at it! Your Score: ${result}</h3>
            <h3> <a href="taketest.html">Take Quiz</a> <i class="fas fa-redo-alt"></i></h3>
        `);
        }
    })
      
   
    function processResults(userV, correctV) {
        let score = 0;
       for (let i = 0; i < correctV.length; i++) {
        
        if(userV[i] === correctV[i]){
            // console.log(userV[i]  + "and" + correctV[i])
            score++;
        }           
       } 
      return score;
    }   
});




