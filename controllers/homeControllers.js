const employee = require('../models/employee');
const salary = require('../models/salary');
const deduct = require('../models/deduction');
const upassword = require('../models/upassword');
const attendence = require('../models/attendence');
const transactions = require('../models/transactions');
const sendMail = require('../services/send_mail');

module.exports.home = function(req,res){
        var errors = [];
        if(req.query.id!=undefined)
        errors.push({msg:req.query.id});
        return res.render('home',{title:"home-login",errors});      
}
let user = {};


module.exports.login = function(req,res){
    
    return res.render('login',{title:"home-login"});  

}



module.exports.adminlog = function(req,res){
    
    if(req.body.username== "admin" && req.body.password == "admin" )
    return res.redirect('/admin/home');  
    else
    {
        var errors;
        errors = 'username or password incorrect';
        return res.redirect('/?id='+errors);
    }
}
module.exports.adminhome = function(req,res){
    var errors = [];
    if(req.query.id!=undefined)
    errors.push({msg:req.query.id});
    
    return res.render('admin',{title:"admin",errors:errors});

}

module.exports.register = function(req,res){
    
    return res.render('register',{title:"register"});

}

module.exports.employees = function(req,res){

    employee.find({}, function (err, docs) {
            var e1 =docs;
            function compare( a, b ) {
                if ( a.eid < b.eid ){
                  return -1;
                }
                if ( a.eid > b.eid ){
                  return 1;
                }
                return 0;
              }
              
              e1.sort( compare );
            return res.render('employees',{title:"employees",emp:docs});
            });
    

}
module.exports.adminregister = function(req,res){
    let body = req.body;
    let emp = {name:body.name,eid:parseInt(body.eid),gender:body.gender,dob:body.dob,
    doj:body.doj, phone:body.phone, address:body.address, dno: body.dno,
    designation:body.designation, sid:parseInt(body.sid),did:parseInt(body.did),
    email: body.email
    }

    let sal = { 
        sid:parseInt(body.sid), base:parseInt(body.base), ma:parseInt(body.ma)
         
    }
    let ded = { 
        did:parseInt(body.did), tax:parseInt(body.tax), leave:parseInt(body.leave), 
        wf:parseInt(body.wf), loan:parseInt(body.loan)
         
    }
    let pass = {
        username:body.uname,
        password:body.password,
        eid: body.eid
    }
    

upassword.create(
 pass    
,function(err,newContact){
    if(err)
    {
        var errors = 'username already exists!';
        return res.redirect('/admin/home/?id='+errors);
    }
    else
    {
        employee.create(
            emp
        ,function(err,newContact){
            if(err)
            {
                var errors = 'EId already exist';
                return res.redirect('/admin/home/?id='+errors);
            }
            else
            {
                salary.create(
                    sal
                ,function(err,newContact){
                    if(err)
                    {
                        var errors = 'Salary Id already exist';
                        return res.redirect('/admin/home/?id='+errors);
                    }
                    else
                    {
                        deduct.create( ded,function(err,newContact){
                            if(err)
                            {
                                var errors = 'Deduction Id already exists!';
                                return res.redirect('/admin/home/?id='+errors);
                            }
                            else
                            {
                                return res.redirect('back');
                            }
                        
                        });
                    }
                
                });
            }
       
    });
    }

});

    

}
// module.exports.play = function(req,res){
//     res.end('Kamboj');   
// }


module.exports.delete  = function(req,res){
    let id = req.query.id;
    
    
    employee.findByIdAndDelete(id,function(err){
        if(err)
        {
            return;
        }
        return res.redirect('back');    
        });
        
    
    
    
}

module.exports.atd = function(req,res){
    
    return res.render('atd',{title:"Attendence"});

}

module.exports.atdp = function(req,res){
    let body = req.body;
    let at = {eid:parseInt(body.eid),month:body.month,leaves:parseInt(body.leave)};
    attendence.find({ eid: at.eid,month:at.month}, function (err, docs) {
        if(err){
            return;
        }
        if(docs.length==0)
        {
        attendence.create(at,function(err,newContact){
        if(err)
        {
            return;
        }
        return res.redirect('back');

    });    }
    else
    {
        return res.redirect('back');
    }
    
    ;})
}


    // em = docs[0];
    // let dept = ['R&D','Production','Marketing','Human Resource','Finance and Accounting']
    // let emp = docs[0];
    // emp.dname = dept[docs[0].dno-1]
    // return res.render('user',{title:"user",personal:p,user:user,employment:e,list:emp});    
    
    
module.exports.transactions = function(req,res){

    var errors = [];
    if(req.query.id!=undefined)
    errors.push({msg:req.query.id});
    return res.render('transactions',{title:"Transactions",errors:errors});

}

module.exports.transactionsp = function(req,res){
    let body = req.body;
    let at = {tid:parseInt(body.tid),eid:parseInt(body.eid),amount:0, month:body.month};
    // transactions.find({ tid: at.tid}, function (err, docs) {
    //     if(err){
    //         return;
    //     }
    //     if(docs.length==0)
    //     {
            employee.find({ eid: at.eid}, function (err, docs) {
                if(docs.length==0)
                    {
                        var errors = 'EId not found';
                        return res.redirect('/admin/transactions/?id='+errors); 
                    }
                var emp = docs[0];
            salary.find({ sid: emp.sid}, function (err, docs) {
                if(docs.length==0)
                    {
                        var errors = 'Salary details not found';
                        return res.redirect('/admin/transactions/?id='+errors); 
                    }
                var sal = docs[0];
                sal.total = sal.base + sal.ma;
                deduct.find({ did: emp.did}, function (err, docs) {
                    if(docs.length==0)
                    {
                        var errors = 'Deduction details not found';
                        return res.redirect('/admin/transactions/?id='+errors); 
                    }
                    var de = docs[0];
                    de.total = de.tax + de.wf + de.loan;
                attendence.find({eid:emp.eid,month:at.month},function(err,docs){
                    if(docs.length==0)
                    {
                        var errors = 'Attendence of month not found';
                        return res.redirect('/admin/transactions/?id='+errors); 
                    }
                    
                    at.amount = sal.total-de.total; 
                    transactions.create(at, async function(err,newContact){
                        if(err)
                        {
                            var errors = 'TId already exists';
                            return res.redirect('/admin/transactions/?id='+errors);
                        }
                        sendMail(emp.email, emp.name).then(_ => {}).catch(err => {
                            console.log(err);
                        });
                        return res.render('transactions',{title:"Transactions"});
                        
                    });       
                
                    });    
                //return res.render('salary',{title:"Salary",user:user,salary:sal,deduct:d});
                });
                    
           });
        });
    }
    // else
    // {
    //     return res.redirect('back');
    // }
    
    // ;})
// }



module.exports.history = function(req,res){
    transactions.find({},function(err,docs){
        if(err)
        {
            return;
        }
        var tsn = docs;
        function compare( a, b ) {
            if ( a.tid > b.tid ){
              return -1;
            }
            if ( a.tid < b.tid ){
              return 1;
            }
            return 0;
          }
          
          tsn.sort( compare );
        return res.render('history',{title:"History",emp:tsn});
        //return res.render('home',{title:"TODO APP",task_list:tasks});
   
    })  
    
    

}
