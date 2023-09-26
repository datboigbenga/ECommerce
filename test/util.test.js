const heyo = (a, b)=>{
    return `your  name is ${a} and age is ${b}`
}

describe("hey my first test", ()=>{
    test("first test", ()=>{
        let a = 1;
        let b = 2;
        (a+b);
        expect(a+b).toBe(3);
    })

    test("first test", ()=>{
        let a = 1;
        let b = 2;
        // (a+b);
        expect(a+b).not.toBe(5);
expect(a+b).toBeGreaterThan(2);
        expect(a+b).toBeGreaterThanOrEqual(2);
        expect(a+b).toBeLessThanOrEqual(10);
        expect(a+b).toBeLessThanOrEqual(10);
        expect(a+b).toBeTruthy();
    })

    test("first test", ()=>{
        let a = 1;
        let b = null;
        (a+b);
        expect(a+b).not.toBeNull();
        expect(a+b).not.toBe(5);
        expect(a+b).toBe(1);
    })

    test("first test", ()=>{
        let a = undefined;

        expect(a).not.toBeNull();
        expect(a).not.toBe(5);
        expect(a).toBeUndefined();
        expect(a).toBe(undefined);
        expect(a).not.toBeDefined();
        expect(a).toBeFalsy();
        expect(a).not.toBeTruthy();

    })

    test("second testing", ()=>{
       const hh = heyo("gbenga", 9)
       expect(hh).toBe(`your  name is gbenga and age is 9`)
    })

    test("Third testing", ()=>{
        const user = [
            "gbenga",
            "tolu",
        ]
        expect(user).toContain("tolu")
     })

    test("Third testing", ()=>{
        const user = {
            name:"gbenga",
            age: 25,
            sex: "Male"
        }
        expect(user).toEqual({
            name:"gbenga",
            age: 25,
            sex: "Male"
        })
     })

     
    test("Third testing", ()=>{
        const user = {
            name:"gbenga",
            age: 25,
        }
        user["sex"] = "Male"
        expect(user).toEqual({
            name:"gbenga",
            age: 25,
            sex: "Male"
        })
     })

     test("Third testing", ()=>{
        const user = {
            name:"gbenga",
            age: 25,
        }
        user.sex = "Male"
        expect(user).toEqual(
            expect.objectContaining({
            name:expect.any(String),
            age: expect.any(Number),
            sex: expect.any(String)
        }))
     })

     test("Third testing", ()=>{
        const user = [
            "gbenga",
            25,
        ]
        const userComplicate = [
            {
                user:"love",
                age:12
            },
            {
                user:"Judge",
                age:16
            },
            {
                user:"Divine",
                age:19
            }
        ]

        userComplicate.push(
            {
                user:"papa",
                age:30
            }
        )
        user.sex = "Male"
        expect(user).toEqual(
            expect.arrayContaining([
            expect.any(String), 
            ]))

        expect(userComplicate).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    user:expect.any(String),
                    age:expect.any(Number)
                })
            ])
        )
     })
})



