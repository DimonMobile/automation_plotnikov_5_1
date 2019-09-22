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
function primeNumberCallback(number, callback) {
    process.nextTick(() => {callback(primeNumber(number));});
}
console.log("Callback function called");
primeNumberCallback(100000, p => console.log("Callback: ", p));

// promises
function primeNumberPromise(number) {
    return new Promise(function(resolve, reject){
        process.nextTick(function() {
            if (number < 0) {
                reject(new Error("Invalid argument (shoud be > 0)"));
            } else {
                resolve(primeNumber(number));
            }
        });
    });
}
console.log("Promise called");
primeNumberPromise(100000).then(p => console.log("Promise:", p), p => console.log("!Error", p));
primeNumberPromise(-5).then(p => console.log("Promise:", p), p => console.log("!Error", p));

// async/await
async function primeNumberAsync(number) {
    return await primeNumberPromise(number);
}
console.log("Async started");
primeNumberAsync(100000).then(p => console.log("Async/Await:", p));

// callback + promise
function primeNumberCallbackAndPromise(number) {
    return new Promise(function(resolve, reject) {
        primeNumberCallback(number, resolve);
    });
}
console.log("Promise + callback called");
primeNumberCallbackAndPromise(100000).then(p => console.log("Promise&Callback:", p));