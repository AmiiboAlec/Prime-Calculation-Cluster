from math import gcd

def coprime(a,b):
    return gcd(a,b) == 1

primes = [2,3,5,7,11,13,17,19,23,29]

def array_product(array, len, func = None):
    output = 1
    for i in range(len):
        next_num = array[i]
        if (func != None):
            next_num = func(next_num)
        output *= next_num
    return output


if (__name__ == '__main__'):
    counter = 1
    while (counter <= len(primes)):
        
        coprime_list = []
        for i in range(base := array_product(primes, counter)):
            if (coprime(base, i)): coprime_list.append(i)
        print("Base %d: %s" % (base, len(coprime_list)))
        counter += 1

        out = open("%d.txt" % base, "w")
        for i in coprime_list:
            out.write("%d\n" % i)
        out.close()

        #if (len(coprime_list) > 32767): break

        
