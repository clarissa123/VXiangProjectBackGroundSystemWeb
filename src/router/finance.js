const financeApply = () => import('@/view/financeManagement/financeApply.vue')
const financeRecord = () => import('@/view/financeManagement/financeRecord.vue')
export default[
            {
                path: "/financeApply",
                name: "financeApply",
                component: financeApply,
                meta: {
                    title: '提现申请',
                    keepAlive: true
                }
            },
            {
                path: "/financeRecord",
                name: "financeRecord",
                component: financeRecord,
                meta: {
                    title: '流水记录',
                    keepAlive: true
                }
            }
]