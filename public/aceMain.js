$(document).ready(function(){
    // let $user = ;
    let $actual = $('.actual');
    let d = 1;
    let bucket;
    let $questions = $('#questions');       //from viewpage
    let $test = $('#test');             //from taketestpage
    let $ques = $('#ques'),         //from createpage
        $addQues = $('#addQues'),
        $option1 = $('#option1'),
        $option2 = $('#option2'),
        $correctAns = $('#correctAns'),
        num = 1,
        n = 1;
    let url = 'http://localhost:5000/';
   
    //GetALL
    $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){            
           $.each(data, function(i, q){
            $questions.append(`
              <br> <li> ${num}. (<strong>Question id: ${q.id}</strong>)  ${q.question} <a href=http://localhost:5000/viewone.html><i class="one fas fa-street-view"></i></a> <i data-id = ${q.id} class="edit fas fa-edit"></i> <i data-id = ${q.id} class="remove fas fa-trash-alt"></i></li><br>
            `)
            num++;
           })       
        }
    });
    
    //getOne
    $('#one').on('keyup', function(e){
        let id = e.target.value;

        $.ajax({
            url: url+'quiz/'+id,
            success: function(q){
                if(q.id === undefined){
                    $('#oneques').html(`
                    <h3><strong>Id cannot be empty</strong></h3>                    
                `)
                }else{
                    $('#oneques').html(`
                    <h3><strong>${q.question}</strong></h3>
                    <p class="option">${q.option1}</p>
                    <p class="option">${q.option2}</p>
                    <p class="side1">${q.correct_answer}</p>
                `)
                }
            }

        })
        
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
    });    

    //delete
    $questions.delegate('.remove', 'click', function(){
        let $li = $(this).closest('li');
        $.ajax({
            type: 'DELETE',
            url: url+'quiz/' + $(this).attr('data-id'),
            success: function(){
                $li.fadeOut(300, function(){
                    $(this).remove();
                    window.location.href = 'http://localhost:5000/allques.html';
                });
            }
        })
    })

    // put req        
    $('#editId').on('keyup', function(e){
        let id = e.target.value;
        $.ajax({
            url: url+'quiz/'+id,
            success: function(q){
               
                 $('#editQ').html(`
                    <li data-id=${id}>
                        <p>
                            <strong>Question: </strong>
                            <span class="noedit question">${q.question}</span>
                            <input class="edit question">
                        </p>
                        <p>
                            <strong>option1: </strong>
                            <span class="noedit option1">${q.option1}</span>
                            <input class="edit option1">
                        </p>
                        <p>
                            <strong>option2: </strong>
                            <span class="noedit option2">${q.option2}</span>
                            <input class="edit option2">
                        </p>
                        <p>
                            <strooption1ng>Correct Option: </strong>
                            <span class="noedit correct_answer">${q.correct_answer}</span>
                            <input class="edit correct_answer">
                        </p>
                        <button class="editQues noedit">Edit Question</button>
                        <button class="saveQ edit">Save Question</button>
                        <button class="cancelEdit edit">Cancel</button>
                     </li>
                `)
                
            }

        })
        
    })

    //editQ
    $('#editQ').delegate('.editQues', 'click', function(){
        let $li = $(this).closest('li');
        $li.find('input.question').val($li.find('span.question').html());
        $li.find('input.option1').val($li.find('span.option1').html());
        $li.find('input.option2').val($li.find('span.option2').html());
        $li.find('input.correct_answer').val($li.find('span.correct_answer').html());
        $li.addClass('edit');
    })

    //canceledit
    $('#editQ').delegate('.cancelEdit', 'click', function(){
         $(this).closest('li').removeClass('edit');
    })
    //save put req
    $('#editQ').delegate('.saveQ', 'click', function(){
        let $li = $(this).closest('li'); 
        let update = {
            question: $li.find('input.question').val(),
            option1: $li.find('input.option1').val(),
            option2: $li.find('input.option2').val(),
            correct_answer: $li.find('input.correct_answer').val()
        };

        $.ajax({
            type: 'PUT',
            url: `${url}quiz/${$li.attr('data-id')}`,
            data: update,
            success: function(newUpdate){
                $li.find('span.question').html(newUpdate.question);
                $li.find('span.option1').html(newUpdate.option1);
                $li.find('span.option2').html(newUpdate.option2);
                $li.find('span.correct_answer').html(newUpdate.correct_answer);
                $li.removeClass('edit');
                // window.location.href = 'http://localhost:5000/allques.html';
            },
            error: function(){
                alert('error updating question');
            }
        });

   })

    //answering the test    
     $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){  
            
           $.each(data, function(i, newQues){

            let $li0 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.option1}"> ${newQues.option1}`;
            let $li1 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.option2}"> ${newQues.option2}`;
            let $li2 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.correct_answer}"> ${newQues.correct_answer}`;
            bucket = [$li0, $li1];
            bucket.splice(Math.floor(Math.random() * 2), 0, $li2);
            
            $test.append(`        
                   <br><p class ="questions"> ${n}. ${newQues.question} </p><br>
                 `)                 
                 $.each(bucket, function(i, q){
                     $test.append(`${q}<br>`)                     
                 });                      
            n++;           
            d++;
           })       
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
            $('.quiz').html(`<br> <h3 class="option">Great job! Your Score: ${result}/${correctVal.length}</h3>
            <h3>   <a href="taketest.html">Take Quiz</a> <i class="fas fa-redo-alt"></i></h3>
        `);
        }else{
            $('.quiz').html(`<h3 class="option"> Keep Working at it! Your Score: ${result}/${correctVal.length}</h3>
            <h3> <a href="taketest.html">Take Quiz</a> <i class="fas fa-redo-alt"></i></h3>
        `);
        }
    })

    //take to test page
    $actual.on('click', function(){

        
        $.ajax({
            type: 'GET',
            url: url+'quiz',
            success: function(data){  
                
               $.each(data, function(i, newQues){
    
                let $li0 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.option1}"> ${newQues.option1}`;
                let $li1 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.option2}"> ${newQues.option2}`;
                let $li2 = `<input class=quesOpt type="radio" name="q${d}" value="${newQues.correct_answer}"> ${newQues.correct_answer}`;
                bucket = [$li0, $li1];
                bucket.splice(Math.floor(Math.random() * 2), 0, $li2);
                
                $test.append(`        
                       <br><p class ="questions"> ${n}. ${newQues.question} </p><br>
                     `)                 
                     $.each(bucket, function(i, q){
                         $test.append(`${q}<br>`)                     
                     });                      
                n++;           
                d++;
               })       
            }
        }); 
    });
      
   
    function processResults(userV, correctV) {
        let score = 0;
       for (let i = 0; i < correctV.length; i++) {
        
        if(userV[i] === correctV[i]){
            score++;
        }           
       } 
      return score;
    }   
});




