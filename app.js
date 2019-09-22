function isPrime(val) {
    if (val === 0)
        return false;
    else if (val > 0 && val <= 2)
        return true;
    else if (val < 0)
        return isPrime(-val);

    for (let i = 2; i < val; ++i) {
        if (val % i === 0) 
            return false;
    }
    return true;
}
// Выводит кол-во простых чисел 0..number
function primeNumber(number) {
    let sum = 0;
    for(let i = 0 ; i <= number; ++i) {
        if (isPrime(i))
            ++sum;
    }
    return sum;
}

// callback
function primeNumberAsync(number, callback) {
    process.nextTick(() => {callback(primeNumber(number));});
}
console.log("Callback function called");
primeNumberAsync(100000, (p) => console.log("Callback: ", p));