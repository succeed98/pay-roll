
const employee = require('../models/employee');
const salary = require('../models/salary');
const deduct = require('../models/deduction');
const upassword = require('../models/upassword');
const transactions = require('../models/transactions');
const attendence = require('../models/attendence');

const pdfMake = require('pdfmake/build/pdfmake.js');
const pdfFonts = require('pdfmake/build/vfs_fonts.js');
pdfMake.vfs = pdfFonts.pdfMake.vfs;
let dept = ['R&D','Production','Marketing','Human Resource','Finance and Accounting'];

let go = {};
let em = {}
let sal = {};
let de= {}
let p = {};
let e = {}
p.name = "Kwaku Frimpond";
p.gender = "Male";
p.dob = "11/10/2001";
p.phone = "9079887964";
p.address = "Accra Central";
e.eid = "10101000";
e.dname = "R&D";
e.designation = "Manager";
e.doj = "11/03/2022";
['dname','designation','doj']

let s = {}


s.base = 40000;

s.ma  = 1000;
let t = 0;
for(i in s)
 t  = t+s[i];
s.total = t
s.sid = 10001;
let d = {}

t = 0;
d.tax = 500;
d.wf = 1000;
d.loan = 1000;
for(i in d)
 t  = t+d[i];
d.total = t;
d.did = 1012;
s.net = s.total-d.total;
let user = {}
user.name = "George";
user.gender = "Male";

module.exports.userlog = function(req,res){

    user.username = req.body.username;
    user.pwd = req.body.password;
    let l;
    
      
    var errors;
    upassword.find({ username: user.username,password:user.pwd}, function (err, docs) {
        if(docs.length==1)
        {
            go = docs[0];      
            return res.redirect('/user/home');
        }
        else
        {
            
            errors = 'username or password incorrect';
    
            return res.redirect('/?id='+errors); 
        }
        
        ;})


       
   
}




module.exports.home = function(req,res){
    employee.find({ eid: go.eid}, function (err, docs) {        
        em = docs[0];
        
        let dept = ['R&D','Production','Marketing','Human Resource','Finance and Accounting']
        let emp = docs[0];
        emp.dname = em.dno
        emp.view = 0;
        if(err)
        {
            return res.redirect('/');
        }
        return res.render('user',{title:"user",personal:p,user:user,employment:e,list:emp});    
        
        ;})
    
    //return res.render('user',{title:"user",personal:p,user:user,employment:e});

}
module.exports.user = function(req,res){
    
    return res.render('user',{title:"Home"});

}

module.exports.salary = function(req,res){
    salary.find({ sid: em.sid}, function (err, docs) {
        sal = docs[0];
        sal.total = sal.base + sal.ma;
        deduct.find({ did: em.did}, function (err, docs) {
            de = docs[0];
            de.total = de.tax + de.wf + de.loan; 
            var list = {};
            list.view = 0;
            return res.render('salary',{title:"Salary",user:user,salary:sal,deduct:de,list:list});
            });    
        //return res.render('salary',{title:"Salary",user:user,salary:sal,deduct:d});
        });
        

}
module.exports.payment = function(req,res){

    transactions.find({ eid: go.eid}, function (err, docs) {
        let emp = docs;
        function compare( a, b ) {
            if ( a.month > b.month ){
              return -1;
            }
            if ( a.month < b.month ){
              return 1;
            }
            return 0;
          }
        var list = {};
        list.view = 0;
        emp.sort( compare );
        return res.render('payment',{title:"Payment",emp:emp,list:list});    
        
        ;})
    //return res.render('payment',{title:"Pay History",user:user});

}
module.exports.attendence = function(req,res){
    attendence.find({ eid: go.eid}, function (err, docs) {
        let emp = docs;
        function compare( a, b ) {
            if ( a.month > b.month ){
              return -1;
            }
            if ( a.month < b.month ){
              return 1;
            }
            return 0;
          }
          
          emp.sort( compare );
          var list = {};
          list.view = 0;  
        return res.render('attendence',{title:"Attendence",emp:emp,list:list});    
        
        ;})
    //return res.render('attendence',{title:"Attendence",user:user});

}

module.exports.pay_slip = function(req,res){
    
    //return res.send('pay');
    //return res.render('attendence',{title:"Attendence",user:user});

    var id = req.query.id;
    var at = {};
        employee.find({ eid: go.eid}, function (err, docs) {
                
                var emp = docs[0];
        salary.find({ sid: emp.sid}, function (err, docs) {
                var sal = docs[0];
                sal.total = sal.base + sal.ma;
                deduct.find({ did: emp.did}, function (err, docs) {
                    
                    var de = docs[0];
                    de.total = de.tax + de.wf + de.loan;
        transactions.find({ tid: id}, function (err, docs) {
                var trans = docs[0];
        attendence.find({eid:emp.eid,month:trans.month},function(err,docs){
                at.amount = sal.total-de.total; 
                    var documentDefinition = {
                        content: [
                           {
                                text: 'Pay Slip\n\n',
                                style: 'header'
                           },
                        {
                        table: {
                                widths: ['*'],
                                body: [[" "], [" "]]
                        },
                        layout: {
                            hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 2;
                            },
                            vLineWidth: function(i, node) {
                                return 0;
                            },
                        }
                        
                        
                       },
                       {
                                style: 'tableExample',
                                table: {
                                    widths: ['33%', '33%', '33%'],
                                    body: [
                                        [[{text:[{text:'Transaction Id:\t',bold:true},`${trans.tid}`]}], [{text:[{text:'Emp Id:\t',bold:true},`${go.eid}`]}], [{text:[{text:'Month:\t',bold:true},`${trans.month}\n\n`]}]],
                                        [[{text:[{lineHeight: 1.4,text:'Name:\n',bold:true},{text:`${emp.name}`}]}], [{text:[{lineHeight: 1.4,text:'Department:\n',bold:true},{text:`${dept[emp.dno-1]}`}]}], [{text:[{lineHeight: 1.4,text:'Designation:\n',bold:true},{text:`${emp.designation}`}]}]],
                                        
                                    ]
                                },
                                layout: 'headerLineOnly',
                                margin: [10, 10, 0, 10],
                            },
                        {
                        table: {
                                widths: ['*'],
                                body: [[" "], [" "]]
                        },
                        layout: {
                            hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 2;
                            },
                            vLineWidth: function(i, node) {
                                return 0;
                            },
                        }
                        
                        
                       },
                        {
                                columns: [
                                    [
                                        {
                                        
                                          text :'Earnings(Ghs.)',
                                          alignment : 'center',
                                          bold : true
                                    },
                                    [
                                      {
                                        lineHeight: 1.4,
                                        text :`\nBasic \t\t\t:\t ${sal.base}`
                                        
                                      },
                                      {
                                        lineHeight: 1.4,
                                        text :`MA \t\t\t\t:\t ${sal.ma}`
                                      }
                                    ]
                                    ],
                                    [
                                    {
                                        
                                      text :'Deductions(Ghs.)',
                                      alignment : 'center',
                                      bold : true
                                    },
                                    {
                                       lineHeight: 1.4,
                                       text :`Tax \t\t\t    :\t ${de.tax}`
                                    },
                                    {
                                       lineHeight: 1.4,
                                       text :`WF  \t\t\t\t:\t ${de.wf}`
                                    },
                                    {
                                       lineHeight: 1.4,
                                       text :`Loan   \t\t\t:\t ${de.loan}`
                                    },
                                    ]
                    
                                    
                                ]
                            },
                        {
                        table: {
                                widths: ['*'],
                                body: [[" "], [" "]]
                        },
                        layout: {
                            hLineWidth: function(i, node) {
                                return (i === 0 || i === node.table.body.length) ? 0 : 2;
                            },
                            vLineWidth: function(i, node) {
                                return 0;
                            },
                        }},
                        {
                            columns:[
                                {
                                    text : `Gross Pay(Ghs.)\t:\t ${sal.total}`
                                },
                                {
                                    text : `Total Deduction(Ghs.)\t:\t ${de.total}`
                                }
                                
                                ]
                        }
                        ,
                        {
                            margin :[0,20,0,0],
                            text: `Net Pay(Ghs.)\t:\t ${at.amount}`,
                            bold : true
                        }
                       
                        ],
                        styles: {
                            header: {
                                fontSize: 18,
                                bold: true,
                                alignment : 'center'
                            },
                            subheader: {
                                fontSize: 15,
                                bold: true
                            },
                            quote: {
                                italics: true
                            },
                            small: {
                                fontSize: 8
                            }
                        }
                        
                    }
                
                
                const pdfDoc = pdfMake.createPdf(documentDefinition);
                let fname = `payslip_eid${go.eid}_month_${trans.month}.pdf`;
                let main = `attachment;filename=${fname}`;
                pdfDoc.getBase64((data)=>{
                res.writeHead(200, 
                {
                    'Content-Type': 'application/pdf',
                    'Content-Disposition':main
                });
                
                const download = Buffer.from(data.toString('utf-8'), 'base64');
                res.end(download);
                });       


                    });
                        
                //return res.render('salary',{title:"Salary",user:user,salary:sal,deduct:d});
                });
                    
           });
        });

});
}
