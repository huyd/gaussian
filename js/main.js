/*
 1) There is a text box where a user can type plain text.
 There is a "submit" button underneath it.

 2) When the user clicks "submit" a notice appears (not as a pop-up, but inline) that says "This user typed more
 characters than X% of users" (more on X below).

 3) X is going to be the cumulative density function of the normal distribution, calculated using this open source library:

 https://github.com/errcw/gaussian#readme
 */

var Main = Class({

    submitBtn : null,
    userInput : null,
    boxAlert : null,

    historyLength:[],
    sum:0,


    init:function(){
        this.submitBtn = $('#submitBtn');
        this.userInput = $('#userInput');
        this.boxAlert = $('#alert-box');
    },

    addHandlers : function(){
        var self = this;
        $(submitBtn).click(function(){
            var len = self.userInput.val().length,
                val = self.calculate(len);
            self.showBox(val);
        });
    },

    calculate : function(x){
        this.historyLength.push(x);
        this.sum += x;

        var count = this.historyLength.length, //count
            mean = this.sum/(count), //calculate mean
            diffSum = 0,
            variance = 0;

        //calculate diff
        $.each(this.historyLength,function(i,num){
            var d = num - mean;
            diffSum += (d*d);
        });

        variance = diffSum/(count);
        if (count ==1){
            return 1;
        }else if (variance==0){
            return 0;
        }
       
        var   gau = Gaussian(mean,variance),
            val = gau.cdf(x);

        return val;
    },

    showBox : function(x){
        x = (x*100).toFixed(2);
        var text = "This user typed more characters than "+ x+"% of users";
        this.boxAlert.text(text).css('visibility','visible');
    }

});


$(document).ready(function(){
    var main = new Main();
    main.addHandlers();
});


