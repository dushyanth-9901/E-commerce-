const bcrypt = require("bcrypt");
// ============================================
// 🔥 RESET PASSWORD
// ============================================

router.post(

  "/reset-password",

  async (req, res) => {

    try {

      const {

        email,
        newPassword

      } = req.body;

      // ============================================
      // 🔍 CHECK USER
      // ============================================
      db.query(

        "SELECT * FROM users WHERE email=?",

        [email],

        async (err, result) => {

          if (err) {

            return res
              .status(500)
              .json(err);

          }

          // ❌ USER NOT FOUND
          if (result.length === 0) {

            return res.status(404).json({
              message: "User Not Found"
            });

          }

          // ============================================
          // 🔐 HASH PASSWORD
          // ============================================
          const hashedPassword =

            await bcrypt.hash(
              newPassword,
              10
            );

          // ============================================
          // 💾 UPDATE PASSWORD
          // ============================================
          db.query(

            "UPDATE users SET password=? WHERE email=?",

            [hashedPassword, email],

            (err2) => {

              if (err2) {

                return res
                  .status(500)
                  .json(err2);

              }

              res.json({
                message:
                  "Password Updated Successfully"
              });

            }

          );

        }

      );

    } catch (error) {

      console.log(error);

      res.status(500).json(error);

    }

  }

);