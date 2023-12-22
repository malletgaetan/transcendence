import gsap from 'gsap'

export function TransparencyValues(ball, paddle, field, floatValue, fieldValue) {
    gsap.to(ball.ballMaterial, { opacity: floatValue, duration: 1, ease: "expo.inOut" })
    gsap.to(field.fieldMaterial, { opacity: fieldValue, duration: 1, ease: "expo.inOut" })
    gsap.to(paddle.paddleMaterial, { opacity: floatValue, duration: 1, ease: "expo.inOut" })
    gsap.to(paddle.paddleMaterial, { opacity: floatValue, duration: 1, ease: "expo.inOut" })
}