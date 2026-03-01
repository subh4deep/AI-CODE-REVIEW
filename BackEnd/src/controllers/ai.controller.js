// import aiService from "../services/ai.service.js";

// export const getReview = async (req, res) => {

//     const code = req.body.code;

//     if (!code) {
//         return res.status(400).send("Prompt is required");
//     }

//     const response = await aiService(code);


//     res.send(response);

// }
import aiService from "../services/ai.service.js";

export const getReview = async (req, res) => {
  try {
    const { code } = req.body;

    // Basic validation
    if (!code || typeof code !== "string" || code.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Valid code is required in request body"
      });
    }

    const review = await aiService(code);

    return res.status(200).json({
      success: true,
      review
    });

  } catch (error) {
    console.error("Error in getReview:", error.message);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};