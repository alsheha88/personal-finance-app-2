export function calculatePieData(budgetSummary, getTotalFn){
    return budgetSummary.map((item) => {
        return {
            value: getTotalFn(item.category),
            color: item.theme
        }
    })
}

export function polarToCart(angleDeg){
    const rad = (angleDeg - 90) * Math.PI / 180
    return [
        119.984 + 119.984 * Math.cos(rad),
        119.984 + 119.984 * Math.sin(rad)
    ]
}
export function makeSlicePath(startAngle, endAngle){
    const [x1, y1] = polarToCart(startAngle)
    const [x2, y2] = polarToCart(endAngle)
    const largeArc = (endAngle - startAngle) > 180 ? 1 : 0
    return `M 119.984 119.984 L ${x1} ${y1} A 119.984 119.984 0 ${largeArc} 1 ${x2} ${y2} Z`
}
export function generatePieChart(budgetSummary, getTotalFn){
    const pieData = calculatePieData(budgetSummary, getTotalFn)
    const total = pieData.reduce((acc, item) => acc + item.value, 0)
    let startAngle = 0

    const paths = pieData.map((item) => {
        const endAngle = startAngle + (item.value / total) * 360
        const path = makeSlicePath(startAngle, endAngle)
        startAngle = endAngle
        return `<path d="${path}" fill="${item.color}" />`
    }).join('')

    return paths
}