import { logMe } from "App/Helpers";
import User from "App/Models/User";

const sponsor = {


    getSponsorTree: async function (usr: User) {
        try {

            const user = await User.query()
                .where('id', usr!.id)

                // level 1
                .preload('children', (q) => {

                    //level 2
                    q.preload('children', q => {

                        // level 3
                        q.preload('children', q => {

                            // level 4
                            q.preload('children', q => {

                                // level 3
                                q.preload('children', q => {

                                    // level 5
                                    q.preload('children', q => {

                                        // level 6
                                        q.preload('children', q => {

                                            // level 7
                                            q.preload('children', q => {

                                                //level 8
                                                q.preload('children', q => {

                                                    // level 9
                                                    q.preload('children', q => {

                                                        //level 10
                                                        q.preload('children', q => {

                                                            // level 11
                                                            q.preload('children')
                                                        })
                                                    })
                                                })
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
                .first()


            var myMatrix: Array<Object> = [
                {
                    id: user?.id,
                    parent: null,
                    title: user?.full_name,
                    description: user?.email,
                    image: user?.avatar
                }
            ]

            function returnMatrixUser(usrr) {

                // const mrx =     
                // myMatrix.push(mrx)


                if (usrr.children?.length) {

                    usrr.children.forEach(child => {

                        //    console.log('Pair user', pair)
                        // if (pair.child) {
                        myMatrix.push({
                            id: child.id,
                            parent: child.ref_by,
                            title: child?.full_name,
                            description: child?.email,
                            image: child?.avatar
                        })

                        returnMatrixUser(child)


                        // }

                    })


                }

            }

            returnMatrixUser(user)

            console.log('userInMatrix', myMatrix)

            return { ok: true, matrix: myMatrix };

        } catch (error) {
            logMe('Module matrix.getUserMatrix: ', error.message);
            return { ok: false, matrix: [], msg: error.message }
        }
    }

}

export default sponsor;