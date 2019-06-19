// evaluateTest = [{
//     title: '一、财务状况',
//     content: [{
//         subtitle: '您的主要收入来源是：',
//         subcontent: ['A. 工资、劳务报酬',
//             'B. 生产经营所得',
//             'C. 利息、股息、转让证券等金融性资产收入',
//             'D. 出租、出售房地产等非金融性资产收入',
//             'E. 无固定收入，或者个人或家庭人均收入低于当地城乡居民最低生活保障标准'
//         ]
//     }, {
//         subtitle: '最近您家庭预计进行证券投资的资金占家庭现有总资产(不含自住、自用房产及汽车等固定资产)的比例是：',
//         subcontent: ['A．70%以上',
//             'B．50%-70%', 
//             'C．30%－50%',
//             'D．10%－30%',
//             'E．10%以下',
//         ]
//     }]
// }, {
//     title: '二、投资知识',
//     content: [{
//         subtitle: '以下描述中何种符合您的实际情况：',
//         subcontent: ['A. 现在或此前曾从事金融、经济或财会等与金融产品投资相关的工作超过两年',
//             'B. 已取得金融、经济或财会等与金融产品投资相关专业学士以上学位',
//             'C. 取得证券从业资格、期货从业资格、注册会计师证书（CPA）或注册金融分析师证书（CFA）中的一项及以上',
//             'D. 我不符合以上任何一项描述'
//             ]
//     }, {
//         subtitle: '您的投资经验可以被概括为：',
//         subcontent: ['A．有限：除银行活期账户和定期存款外，我基本没有其他投资经验或者证券期货投资知识',
//             'B．一般：除银行活期账户和定期存款外，我购买过基金、保险等理财产品，但还需要进一步的指导',
//             'C．丰富：我是一位有经验的投资者，参与过股票、基金等产品的交易，并倾向于自己做出投资决策',
//             'D．非常丰富：我是一位非常有经验的投资者，参与过权证、期货或创业板等高风险产品的交易'
//         ]
//     }]
// }],
evaluateTest = [{
    RE_id: 1,
    content: "您的主要收入来源是：",
    options: ['A. 工资、劳务报酬',
        'B. 生产经营所得',
        'C. 利息、股息、转让证券等金融性资产收入',
        'D. 出租、出售房地产等非金融性资产收入',
        'E. 无固定收入，或者个人或家庭人均收入低于当地城乡居民最低生活保障标准'
    ],
    type: '财务状况',
    isRadio: false
}, {
    RE_id: 2,
    content: "以下描述中何种符合您的实际情况:", 
    options: ['A. 现在或此前曾从事金融、经济或财会等与金融产品投资相关的工作超过两年',
        'B. 已取得金融、经济或财会等与金融产品投资相关专业学士以上学位',
        'C. 取得证券从业资格、期货从业资格、注册会计师证书（CPA）或注册金融分析师证书（CFA）中的一项及以上',
        'D. 我不符合以上任何一项描述'
    ], 
    type: "投资知识", 
    isRadio: true 
}]
answer = [[],[]]