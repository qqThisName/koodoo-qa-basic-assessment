const {
    standardDeviation,
    sanitizeAmounts,
    roundToTwoDp,
    analysePayments
} = require('./analyze.js')
const test = require('ava')

test('Standard Deviation is correct for Basic Data', t => {
    //First Argument for t.is is actual, second is expected
    t.deepEqual(standardDeviation([1, 2, 2, 2, 1, 1]), 0.5)
})

test('Payments are analysed correctly', t => {
    //First Argument for t.is is actual, second is expected
    t.deepEqual(analysePayments([{
            "Amount": 1,
            "TransactionInformation": "Payment One"
        },
        {
            "Amount": 2,
            "TransactionInformation": "Payment Two"
        },
        {
            "Amount": 3,
            "TransactionInformation": "Payment Three"
        },
        {
            "Amount": 4,
            "TransactionInformation": "Payment Four"
        }
    ]), {
        max: 4,
        mean: 2.5,
        median: 2.5,
        min: 1,
        standardDeviation: 1.12,
    })
})

test('It should round the amound up to nearest decimal > increase ', t => {
   
    t.deepEqual(roundToTwoDp(10.974), 10.97)
})
test('It should round the amound up to nearest decimal > decrease ', t => {
  
    t.deepEqual(roundToTwoDp(10.975), 10.98)
})
test('It should round the amound up to nearest decimal increase > fail ', t => {
 
    t.deepEqual(roundToTwoDp(10.974), 10.98)
})
test('It should round the amound up to nearest decimal decrease > fail ', t => {
  
    t.deepEqual(roundToTwoDp(10.976), 10.97)
})
test('It should round the amound up to nearest decimal,  negative number  decrease', t => {
    //expect correct result
    t.deepEqual(roundToTwoDp(-50.866), -50.87)
})
test('It should round the amound up to nearest decimal,  negative number  increase', t => {
    //expect correct result
    t.deepEqual(roundToTwoDp(-50.864), -50.86)
})
test('It should sanitize string value with decimal point ', t => {
    //expect correct result
    t.deepEqual(sanitizeAmounts([{ "Amount": "750.1"}]),[750.1])
})
test('It should sanitize string value without decimal point ', t => {
    //expect correct result
    t.deepEqual(sanitizeAmounts([{ "Amount": "750"}]),[750])
})
test('It should sanitize string value negative number ', t => {
    //expect correct result
    t.deepEqual(sanitizeAmounts([{ "Amount": "-750"}]),[-750])
})
test('It should  sanitize string value with coma point ', t => {
    //expect failed test
    t.deepEqual(sanitizeAmounts([{ "Amount": "750,000,000"}]),[750000000])
})
test('It should  sanitize value that doesnt need sanitation  ', t => {
    //expect correct result
    t.deepEqual(sanitizeAmounts([{ "Amount": 750}]),[750])
})
test('It should  analyse payments with large value', t => {
    //expect correct reult
    t.deepEqual(analysePayments([{
    "Amount": 9999999999999999999999999999999999999999999999,
    "TransactionInformation": ">50 Dogs Bar"
    }, 
     ]),
      {
        max: 1e+46,
        mean: 1e+46,
        median: 1e+46,
        min: 1e+46,
        standardDeviation: 0,
    })
})
test('It should fail to analyse payments for text values', t => {
    //expect failed test
    t.deepEqual(analysePayments([{
    "Amount": "50 Dogs Bar",
    "TransactionInformation": "50 Dogs Bar"
    },
     ]),
     {
        max: 4,
        mean: 2.5,
        median: 2.5,
        min: 1,
        standardDeviation: 1.12,
    })
})

test('It should try  to analyse payments without amount input', t => {
    //expect failed test
    t.deepEqual(analysePayments([{
    "TransactionInformation": "50 Dogs Bar"
    },
 ]),
    {
       max: 4,
       mean: 2.5,
       median: 2.5,
       min: 1,
       standardDeviation: 1.12,
   })
})
test('It should try  to analyse payments without TransactionInformation input', t => {
    //expect failed test
    t.deepEqual(analysePayments([{
     "Amount":- 50,   
    },
 ]),
    {
       max: -50,
       mean: -50,
       median: -50,
       min: -50,
       standardDeviation: 0,
   })
})
test('It should try  to analyse payments without  input', t => {
    //expect failed test
    t.deepEqual(analysePayments([{}]),
    {
       max: 0,
       mean: 0,
       median: 0,
       min: 0,
       standardDeviation: 0,
   })
})