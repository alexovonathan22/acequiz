$(document).ready(function(){
    // let $users = $('#users');
    let $questions = $('#questions');
    let $test = $('#test');
    let $ques = $('#ques'),
        $addQues = $('#addQues'),
        $option1 = $('#option1'),
        $option2 = $('#option2'),
        $correctAns = $('#correctAns'),
        num = 1;
    let url = 'http://localhost:5000/';
    //Get
    $.ajax({
        type: 'GET',
        url: url+'quiz',
        success: function(data){            
           $.each(data, function(i, q){
            $questions.append(`
              <br> <li> ${num}.  ${q.question}</li><br>                 
            `)
            num++;
           })
        console.log(data);
        
        }
    });

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
            url: url+'quiz',
            data: question,
            success: function(newQues){
                // $test.append(`
                //    <li> ${newQues.id} </li>
                //    <li> ${newQues.question} </li>
                //    <li> ${newQues.option1} </li>
                //    <li> ${newQues.option2} </li>
                //    <li> ${newQues.correct_answer} </li>
                // `)
            },
            error: function(){
                alert('error adding question')
            }
        });
    })    
});