import { logMe } from "App/Helpers";
import Matrix from "App/Models/Matrix";
import MatrixPair from "App/Models/MatrixPair";
import User from "App/Models/User";

const matrix = {

    placeIntoMatrix: async function (user: User) {

        try {

            // find the user is exist in the matrix or not

            const userInMatrix = await Matrix.query()
                .where('user_id', user.id)
                .first();

            if (userInMatrix) {

                if (userInMatrix.status == false) {
                    userInMatrix.status = true;
                    return await userInMatrix.save();
                }

                return userInMatrix;

            } else {
                // find available matrix pair

                // amp == availableMatrixPair
                const amp = await MatrixPair.query()
                    .whereNull('child_id')
                    .first();

                console.log('Available matrix pair: ', amp?.id);

                // nm == newMatrix
                const nm = new Matrix()

                nm.user_id = user.id;

                if (amp) {
                    nm.parent_matrix_id = amp!.matrix_id
                    nm.parent_user_id = amp!.user_id
                } else {
                    nm.parent_matrix_id = null
                    nm.parent_user_id = null
                }

                nm.status = true;
                await nm.save();

                user.matrix_id = nm.id;
                await user.save();

                if (amp) {
                    amp.child_id = nm.user_id
                    await amp.save();
                }

                var createdPairs: Array<MatrixPair> = []

                for (let i = 1; i <= 3; i++) {
                    // const newMatrixPair = new MatrixPair();
                    // newMatrixPair.user_id = user.id
                    // newMatrixPair.matrix_id = nm.id
                    // newMatrixPair.child_id = null
                    // await newMatrixPair.save();

                    const newMatrixPair = await MatrixPair.create({
                        user_id: user.id,
                        matrix_id: nm.id,
                        child_id: null
                    })

                    console.log('newMatrixPair created', newMatrixPair.id);

                    createdPairs.push(newMatrixPair)
                }

                console.log('Array length of created pairs: ', createdPairs.length);
            }

        } catch (error) {
            logMe('Module matrix.placeIntoMatrix: ', error.message);
        }


    },

    getUserMatrix: async function (usr: User) {
        try {

            // const userInMatrix = await Matrix.query()
            //     .where('user_id', user.id)
            //     .preload('pairs', (q) => {
            //         q.preload('user', q => {
            //             // level 1
            //             q.preload('matrix', q => {
            //                 q.preload('pairs', q => {
            //                     q.preload('user', q => {
            //                         // level 2
            //                         q.preload('matrix', q => {
            //                             q.preload('pairs', q => {
            //                                 q.preload('user', q => {
            //                                     // level 3
            //                                     q.preload('matrix', q => {
            //                                         q.preload('pairs', q => {
            //                                             q.preload('user', q => {
            //                                                 // level 4
            //                                                 q.preload('matrix', q => {
            //                                                     q.preload('pairs', q => {
            //                                                         q.preload('user', q => {
            //                                                             // level 5
            //                                                             q.preload('matrix', q => {
            //                                                                 q.preload('pairs', q => {
            //                                                                     q.preload('user', q => {
            //                                                                         // level 6
            //                                                                         q.preload('matrix', q => {
            //                                                                             q.preload('pairs', q => {
            //                                                                                 q.preload('user', q => {
            //                                                                                     //level 7
            //                                                                                     q.preload('matrix', q => {
            //                                                                                         q.preload('pairs', q => {
            //                                                                                             q.preload('user', q => {
            //                                                                                                 // level 8
            //                                                                                                 q.preload('matrix', q => {
            //                                                                                                     q.preload('pairs', q => {
            //                                                                                                         q.preload('user', q => {
            //                                                                                                             // level 9
            //                                                                                                             q.preload('matrix', q => {
            //                                                                                                                 q.preload('pairs', q => {
            //                                                                                                                     q.preload('user', q => {
            //                                                                                                                         // level 10
            //                                                                                                                         q.preload('matrix', q => {
            //                                                                                                                             q.preload('pairs', q => {
            //                                                                                                                                 q.preload('user')
            //                                                                                                                             })
            //                                                                                                                         })
            //                                                                                                                     })
            //                                                                                                                 })
            //                                                                                                             })
            //                                                                                                         })
            //                                                                                                     })
            //                                                                                                 })
            //                                                                                             })
            //                                                                                         })
            //                                                                                     })
            //                                                                                 })
            //                                                                             })
            //                                                                         })
            //                                                                     })
            //                                                                 })
            //                                                             })
            //                                                         })
            //                                                     })
            //                                                 })
            //                                             })
            //                                         })
            //                                     })
            //                                 })
            //                             })
            //                         })
            //                     })
            //                 })
            //             })
            //         })
            //     })
            //     .first()

            const user = await User.query()
                .where('id', usr!.id)

                // level 1
                .preload('pairs', (q) => {

                    q.preload('child', q => {

                        //level 2
                        q.preload('pairs', q => {
                            q.preload('child', q => {

                                // level 3
                                q.preload('pairs', q => {
                                    q.preload('child', q => {

                                        // level 4
                                        q.preload('pairs', q => {
                                            q.preload('child', q => {

                                                //level 5
                                                q.preload('pairs', q => {
                                                    q.preload('child', q => {

                                                        //level 6
                                                        q.preload('pairs', q => {
                                                            q.preload('child', q => {

                                                                //level 7
                                                                q.preload('pairs', q => {
                                                                    q.preload('child', q => {

                                                                        // level 8
                                                                        q.preload('pairs', q => {
                                                                            q.preload('child', q => {

                                                                                // levle 9
                                                                                q.preload('pairs', q => {
                                                                                    q.preload('child', q => {

                                                                                        // level 10
                                                                                        q.preload('pairs', q => {
                                                                                            q.preload('child')
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


                if (usrr.pairs?.length) {

                    usrr.pairs.forEach(pair => {

                        //    console.log('Pair user', pair)
                        if (pair.child) {
                            myMatrix.push({
                                id: pair?.child.id,
                                parent: pair?.user_id,
                                title: pair?.child?.full_name,
                                description: pair?.child?.email,
                                image: pair?.child?.avatar
                            })

                            if (pair?.child?.pairs?.length) {
                                returnMatrixUser(pair.child)
                            }

                        }

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

export default matrix;