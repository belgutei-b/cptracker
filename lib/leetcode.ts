"use server";
/*
query singleQuestionTopicTags($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    topicTags {
      name
      slug
    }
  }
}
{"titleSlug": "two-sum"}

query questionTitle($titleSlug: String!) {
  question(titleSlug: $titleSlug) {
    questionId
    questionFrontendId
    title
    titleSlug
    isPaidOnly
    difficulty
    likes
    dislikes
  }
}
{"titleSlug": "two-sum"}
*/
// https://github.com/akarsh1995/leetcode-graphql-queries/blob/main/problem_solve_page/problem_solve_page.graphql

export async function getProblemTags(slug: string) {
  const query = `
    query singleQuestionTopicTags($titleSlug: String!) {
      question(titleSlug: $titleSlug) {
        questionId
        title
        titleSlug
        difficulty
          topicTags {
            name
            slug
          }
        }
      }
  `;
  const res = await fetch("https://leetcode.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      variables: { titleSlug: slug },
    }),
  });
  const data = await res.json();

  console.log(res);
  console.log(data);
  console.log(data.data.question.topicTags);
  console.log(data.data.question);
}
