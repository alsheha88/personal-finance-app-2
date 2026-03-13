export function formatAmount(amount, showSign = true) {
    const formatted = Math.abs(amount).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })

    if (!showSign) return `$${formatted}`
    if (amount < 0) return `-$${formatted}`
    if (amount > 0) return `+$${formatted}`
    return `$${formatted}`
}

export function formatDate(date) {
	const unformattedDate = new Date(date);
	const options = {
		day: "2-digit",
		month: "short",
		year: "numeric",
	};
	const formattedDate = new Intl.DateTimeFormat("en-GB", options).format(
		unformattedDate,
	);

	return formattedDate;
}

export function testInput(value){
	return value
}

export function filterData(data, category){
	return data.filter((item) => item.category === category)
}
export function calculateTotal(data){
	return data.reduce((total, item) => total + item.amount, 0)
}